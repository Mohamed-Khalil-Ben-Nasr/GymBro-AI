from workout import *
import os
from os.path import join

def get_exercises():
    exercises = []

    f = open("./backend/utils/exercises.txt", "r")
    line = f.readline()
    while line:
        name, rest = line[2:].split(" (")
        difficulty, rest = rest.split(") [")
        bodyareas = rest.split("]")[0].split(", ")

        difficulty = ExerciseDifficulty[difficulty.upper()]
        for i in range(len(bodyareas)):
            bodyareas[i] = ExerciseBodyArea[bodyareas[i].upper()]

        exercises.append(
            Exercise(
                name,
                difficulty,
                bodyareas
        ))

        line = f.readline()

    return exercises


def capitalize(exercise_name: str):
    words = exercise_name.split("_")
    for i in range(len(words)):
        words[i] = words[i][0].upper() + words[i][1:]
    return " ".join(words)

def decapitalize(exercise_name: str):
    return exercise_name.lower().replace(" ", "_")
    
path = join(os.getcwd(), "backend/workout_images/back")
print(path)
with open("./backend/utils/exercises.txt", "r") as f:
    print(f.readlines())
    # f.writelines([filename.split(".")[0]+"\n" for filename in os.listdir(path)])

# wf = open("./backend/utils/exercises_renamed.txt", "w")

# with open("./backend/utils/exercises.txt", "r") as f:
#     wf.writelines([capitalize(exercise) for exercise in f.readlines()])

