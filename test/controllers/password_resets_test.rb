require "test_helper"

class PasswordResetsTest < ActionDispatch::IntegrationTest
  include ActionMailer::TestHelper

  setup do
    ActionMailer::Base.deliveries.clear
    @user = User.create!(
      full_name: "Cliente Recuperacion",
      email: "recuperacion@example.com",
      phone: "+502 5555 5555",
      password: "password123",
      role: "client",
    )
  end

  test "user requests a password reset email" do
    get new_password_reset_path
    assert_response :success

    assert_emails 1 do
      post password_resets_path, params: { password_reset: { email: @user.email.upcase } }
    end

    assert_redirected_to login_path
    email = ActionMailer::Base.deliveries.last
    assert_equal [@user.email], email.to
    assert_includes email.body.encoded, "/password/reset/"
  end

  test "unknown email receives the same response without sending email" do
    assert_no_emails do
      post password_resets_path, params: { password_reset: { email: "nadie@example.com" } }
    end

    assert_redirected_to login_path
  end

  test "user resets password with a valid token" do
    token = @user.signed_id(purpose: :password_reset, expires_in: 30.minutes)

    get edit_password_reset_path(token)
    assert_response :success

    patch password_reset_path(token), params: {
      user: {
        password: "newpassword123",
        password_confirmation: "newpassword123",
      },
    }

    assert_redirected_to login_path
    assert @user.reload.authenticate("newpassword123")
  end

  test "invalid token redirects to request a new link" do
    get edit_password_reset_path("token-invalido")

    assert_redirected_to new_password_reset_path
  end
end
