from UUID import UUIDBuilder

uuid = UUIDBuilder(10).build()

print(uuid.generate_one())

uuid = UUIDBuilder(20).add_digits().add_punctuations().add_upper_case().build()

print(uuid.generate_one())
