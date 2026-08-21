# frozen_string_literal: true

class ProgressReport
  def initialize(client_profile)
    @client_profile = client_profile
  end

  def as_json
    workouts = completed_workouts.to_a
    results = workouts.flat_map(&:exercise_results).select(&:completed?)
    weighted_results = results.select { |result| result.actual_weight_lb.present? }

    {
      summary: {
        completed_workouts: workouts.size,
        total_volume_lb: weighted_results.sum { |result| volume(result) }.round(1),
        max_weight_lb: weighted_results.map { |result| result.actual_weight_lb.to_f }.max.to_f,
        last_workout_at: workouts.map(&:completed_at).compact.max
      },
      weekly_activity: weekly_activity(workouts),
      exercise_progress: exercise_progress(weighted_results)
    }
  end

  private

  def completed_workouts
    @client_profile.workout_sessions.where(status: "completed")
      .includes(exercise_results: :exercise).order(completed_at: :asc)
  end

  def volume(result)
    result.completed_sets * result.actual_repetitions * result.actual_weight_lb.to_f
  end

  def weekly_activity(workouts)
    start_of_week = Time.zone.today.beginning_of_week
    (7).downto(0).map do |weeks_ago|
      week = start_of_week - weeks_ago.weeks
      {
        label: week.strftime("%d/%m"),
        value: workouts.count { |workout| workout.completed_at&.to_date&.between?(week, week + 6.days) }
      }
    end
  end

  def exercise_progress(results)
    grouped = results.group_by { |result| result.exercise.name }
    grouped.sort_by { |_name, items| -items.size }.first(6).map do |name, items|
      {
        name: name,
        points: items.sort_by { |result| result.workout_session.completed_at || result.created_at }.map do |result|
          {
            date: (result.workout_session.completed_at || result.created_at).to_date,
            weight_lb: result.actual_weight_lb.to_f,
            volume_lb: volume(result).round(1)
          }
        end
      }
    end
  end
end
