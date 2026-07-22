require "test_helper"

class RoleDashboardsTest < ActionDispatch::IntegrationTest
  test "trainer login redirects to the trainer dashboard" do
    trainer = create_user(role: "trainer")

    post login_path, params: { session: { email: trainer.email, password: "password123" } }

    assert_redirected_to trainer_dashboard_path
  end

  test "login distinguishes an unknown email from a wrong password" do
    user = create_user(role: "client")

    post login_path, params: { session: { email: "no-existe@example.com", password: "password123" } }
    assert_redirected_to login_path
    follow_redirect!
    assert_includes response.body, "El correo electrónico no está registrado."

    post login_path, params: { session: { email: user.email, password: "incorrecta" } }
    assert_redirected_to login_path
    follow_redirect!
    assert_includes response.body, "Usuario o contraseña incorrecta."
  end

  test "client cannot access trainer dashboard" do
    client = create_user(role: "client")
    sign_in(client)

    get trainer_dashboard_path

    assert_redirected_to dashboard_path
  end

  test "admin can access admin dashboard" do
    admin = create_user(role: "admin")
    sign_in(admin)

    get admin_dashboard_path

    assert_response :success
  end

  test "public registration cannot create an admin" do
    post register_path, params: {
      user: {
        full_name: "Public Admin",
        email: "public-admin@example.com",
        phone: "+502 5555 0000",
        password: "password123",
        role: "admin",
      },
    }

    assert_equal "client", User.find_by!(email: "public-admin@example.com").role
    assert_redirected_to client_dashboard_path
  end

  test "registration password errors are returned in Spanish" do
    post register_path, params: {
      user: {
        full_name: "Nuevo Cliente",
        email: "nuevo@example.com",
        phone: "+502 5555 0000",
        password: "corta",
        password_confirmation: "distinta",
        role: "client",
      },
    }

    assert_redirected_to register_path
    follow_redirect!
    assert_includes response.body, "debe tener al menos 8 caracteres"
    assert_includes response.body, "no coincide"
  end

  private

  def create_user(role:)
    User.create!(
      full_name: "Test #{role}",
      email: "#{role}-#{SecureRandom.hex(4)}@example.com",
      phone: "+502 5555 5555",
      password: "password123",
      role: role,
    )
  end

  def sign_in(user)
    post login_path, params: { session: { email: user.email, password: "password123" } }
  end
end
