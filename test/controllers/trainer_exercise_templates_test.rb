require "test_helper"

class TrainerExerciseTemplatesTest < ActionDispatch::IntegrationTest
  setup do
    @trainer = create_user("trainer")
    @client = create_user("client")
  end

  test "trainer manages exercise templates" do
    sign_in(@trainer)

    get trainer_exercise_bank_path
    assert_response :success

    assert_difference("ExerciseTemplate.count", 1) do
      post trainer_exercise_templates_path, params: {
        exercise_template: {
          name: "Press banca",
          muscle_group: "Pecho",
          equipment: "Barra",
          notes: "Controlar tecnica"
        }
      }
    end

    template = @trainer.trainer_profile.exercise_templates.last
    assert_redirected_to trainer_exercise_bank_path
    assert_equal "Press banca", template.name

    patch trainer_exercise_template_path(template), params: {
      exercise_template: {
        equipment: "Maquina",
        notes: "Subir peso con buena forma"
      }
    }

    assert_redirected_to trainer_exercise_bank_path
    assert_equal "Maquina", template.reload.equipment
    assert_equal "Subir peso con buena forma", template.notes

    assert_difference("ExerciseTemplate.count", -1) do
      delete trainer_exercise_template_path(template)
    end
    assert_redirected_to trainer_exercise_bank_path
  end

  test "client cannot access trainer exercise bank" do
    sign_in(@client)

    get trainer_exercise_bank_path

    assert_redirected_to dashboard_path
  end

  test "trainer cannot edit another trainers template" do
    another_trainer = create_user("trainer")
    template = another_trainer.trainer_profile.exercise_templates.create!(
      name: "Remo con barra",
      muscle_group: "Espalda",
    )
    sign_in(@trainer)

    patch trainer_exercise_template_path(template), params: {
      exercise_template: { name: "Nombre cambiado" }
    }

    assert_response :not_found
    assert_equal "Remo con barra", template.reload.name
  end

  private

  def create_user(role)
    User.create!(
      full_name: "Test #{role}",
      email: "#{role}-#{SecureRandom.hex(5)}@example.com",
      phone: "+502 5555 5555",
      password: "password123",
      role: role,
    )
  end

  def sign_in(user)
    post login_path, params: { session: { email: user.email, password: "password123" } }
  end
end
