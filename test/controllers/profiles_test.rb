require "test_helper"

class ProfilesTest < ActionDispatch::IntegrationTest
  test "each role can open its profile" do
    { "client" => client_profile_path, "trainer" => trainer_profile_path, "admin" => admin_profile_path }.each do |role, path|
      user = create_user(role)
      sign_in(user)

      get path

      assert_response :success
      delete logout_path
    end
  end

  test "user updates name phone and password" do
    client = create_user("client")
    sign_in(client)

    patch client_profile_path, params: {
      user: {
        full_name: "Nombre Actualizado",
        phone: "+502 4444 4444",
        password: "newpassword123",
        password_confirmation: "newpassword123",
      },
    }

    assert_redirected_to client_profile_path
    client.reload
    assert_equal "Nombre Actualizado", client.full_name
    assert_equal "+502 4444 4444", client.phone
    assert client.authenticate("newpassword123")
  end

  test "client cannot access trainer profile" do
    client = create_user("client")
    sign_in(client)

    get trainer_profile_path

    assert_redirected_to dashboard_path
  end

  private

  def create_user(role)
    User.create!(full_name: "Test #{role}", email: "#{role}-#{SecureRandom.hex(5)}@example.com",
      phone: "+502 5555 5555", password: "password123", role: role)
  end

  def sign_in(user)
    post login_path, params: { session: { email: user.email, password: "password123" } }
  end
end
