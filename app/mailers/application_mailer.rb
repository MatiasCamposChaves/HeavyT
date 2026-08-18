class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch("GMAIL_SMTP_USER", "no-reply@heavyt.local")
  layout "mailer"
end
