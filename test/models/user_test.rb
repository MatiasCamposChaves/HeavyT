require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "accepts the supported roles" do
    User::ROLES.each do |role|
      user = build_user(role: role, email: "#{role}@example.com")
      assert user.valid?, user.errors.full_messages.to_sentence
    end
  end

  test "rejects an unsupported role" do
    user = build_user(role: "super_admin")

    assert_not user.valid?
    assert_includes user.errors[:role], "is not included in the list"
  end

  private

  def build_user(role:, email: "person@example.com")
    User.new(
      full_name: "Test Person",
      email: email,
      phone: "+502 5555 5555",
      password: "password123",
      role: role,
    )
  end
end
