require "test_helper"

class AdminUsersTest < ActionDispatch::IntegrationTest
  setup do
    @admin = create_user(role: "admin")
    @client = create_user(role: "client")
    sign_in(@admin)
  end

  test "admin can list, view and update managed users" do
    get admin_users_path
    assert_response :success

    get admin_user_path(@client)
    assert_response :success

    patch admin_user_path(@client), params: {
      user: { full_name: "Cliente Actualizado", phone: "+502 4444 4444" },
    }

    assert_redirected_to admin_user_path(@client)
    assert_equal "Cliente Actualizado", @client.reload.full_name
    assert_equal "+502 4444 4444", @client.phone
  end

  test "admin can block and unblock a user" do
    patch block_admin_user_path(@client)

    assert_redirected_to admin_user_path(@client)
    assert_predicate @client.reload, :blocked?

    patch unblock_admin_user_path(@client)

    assert_redirected_to admin_user_path(@client)
    assert_not_predicate @client.reload, :blocked?
  end

  test "blocked user cannot sign in" do
    patch block_admin_user_path(@client)
    delete logout_path

    post login_path, params: {
      session: { email: @client.email, password: "password123" },
    }

    assert_redirected_to login_path
    follow_redirect!
    assert_response :success
    assert_includes response.body, "Comunícate con administración"
  end

  test "non admin cannot access user management" do
    delete logout_path
    sign_in(@client)

    get admin_users_path

    assert_redirected_to dashboard_path
  end

  test "admin accounts cannot be managed from the module" do
    another_admin = create_user(role: "admin")

    get admin_user_path(another_admin)

    assert_response :not_found
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
