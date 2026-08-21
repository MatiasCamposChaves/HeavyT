# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
demo_users = [
  {
    full_name: "Admin HeavyT",
    email: "admin@heavyt.local",
    phone: "+502 5555 0001",
    role: "admin"
  },
  {
    full_name: "Entrenador HeavyT",
    email: "entrenador@heavyt.local",
    phone: "+502 5555 0002",
    role: "trainer"
  },
  {
    full_name: "Cliente HeavyT",
    email: "cliente@heavyt.local",
    phone: "+502 5555 0003",
    role: "client"
  }
]

demo_users.each do |attrs|
  user = User.find_or_initialize_by(email: attrs[:email])
  user.assign_attributes(attrs)
  user.password = "password123" if user.new_record?
  user.save!
end
