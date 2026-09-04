const { test } = require("@playwright/test")

const baseUrl = "http://localhost:3000"
const viewports = [
  { name: "mobile-360", width: 360, height: 740 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1366", width: 1366, height: 768 },
]
const accounts = [
  { role: "admin", email: "matiascampos974@gmail.com", passwords: ["Prueba12", "Mtsg2104"], paths: ["/admin/dashboard", "/admin/users", "/admin/profile"] },
  { role: "trainer", email: "entrenador@gmail.com", passwords: ["Mtsg2104", "Prueba12", "password123"], paths: ["/trainer/dashboard", "/trainer/routines", "/trainer/exercise-bank", "/trainer/progress", "/trainer/workouts", "/trainer/profile"] },
  { role: "client", email: "cliente@gmail.com", passwords: ["Mtsg2104", "Prueba12", "password123"], paths: ["/client/dashboard", "/client/routines", "/client/progress", "/client/workouts", "/client/profile"] },
]
const report = []

async function login(page, account) {
  for (const password of account.passwords) {
    await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle" })
    await page.locator("input[type='email']").fill(account.email)
    await page.locator("input[type='password']").fill(password)
    await page.locator("button[type='submit']").click()
    await page.waitForLoadState("networkidle").catch(() => {})
    if (!page.url().includes("/login")) return true
  }

  return false
}

async function collectLinks(page, selector) {
  return page.locator(selector).evaluateAll((links) => (
    [...new Set(links.map((link) => link.getAttribute("href")).filter(Boolean))]
  )).catch(() => [])
}

async function pageIssues(page) {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth
    const scrollWidth = document.documentElement.scrollWidth
    const overflowing = Array.from(document.querySelectorAll("body *:not(script):not(style):not(svg):not(path)"))
      .map((element) => {
        const rect = element.getBoundingClientRect()
        return {
          tag: element.tagName.toLowerCase(),
          text: (element.innerText || element.getAttribute("aria-label") || element.getAttribute("title") || "").trim().replace(/\s+/g, " ").slice(0, 70),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        }
      })
      .filter((item) => item.width > 0 && (item.left < -2 || item.right > width + 2))
      .slice(0, 8)

    return { horizontalOverflow: scrollWidth > width + 2, viewportWidth: width, scrollWidth, overflowing }
  })
}

test("responsive smoke check", async ({ browser }) => {
  for (const viewport of viewports) {
    for (const account of accounts) {
      const context = await browser.newContext({ viewport })
      const page = await context.newPage()
      const loggedIn = await login(page, account)

      if (!loggedIn) {
        report.push({ viewport: viewport.name, role: account.role, path: "login", error: "No se pudo iniciar sesion" })
        await context.close()
        continue
      }

      const paths = new Set(account.paths)
      if (account.role === "trainer") {
        for (const href of await collectLinks(page, "a[href^='/trainer/routines/'], a[href^='/trainer/workouts/'], a[href^='/trainer/progress/']")) paths.add(href)
      }
      if (account.role === "client") {
        for (const href of await collectLinks(page, "a[href^='/client/routines/'], a[href^='/client/workouts/']")) paths.add(href)
      }

      for (const path of paths) {
        await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" })
        const issues = await pageIssues(page)
        if (issues.horizontalOverflow || issues.overflowing.length > 0) {
          report.push({ viewport: viewport.name, role: account.role, path, ...issues })
        }
      }

      await context.close()
    }
  }

  console.log(JSON.stringify(report, null, 2))
})
