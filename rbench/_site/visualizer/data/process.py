import json
import os
os.chdir("visualizer/data")
"""
test_data = {
    "1": {
        "question": "When a spring does work on an object, we cannot find the work by simply multiplying the spring force by the object's displacement. The reason is that there is no one value for the force-it changes. However, we can split the displacement up into an infinite number of tiny parts and then approximate the force in each as being constant. Integration sums the work done in all those parts. Here we use the generic result of the integration.\r\n\r\nIn Figure, a cumin canister of mass $m=0.40 \\mathrm{~kg}$ slides across a horizontal frictionless counter with speed $v=0.50 \\mathrm{~m} / \\mathrm{s}$. It then runs into and compresses a spring of spring constant $k=750 \\mathrm{~N} / \\mathrm{m}$. When the canister is momentarily stopped by the spring, by what distance $d$ is the spring compressed?",
        "image": "images/1.jpg",
        "choices": null,
        "answer": "1.2",
        "metadata": {
            "split": "testmini",
            "category": "Algebra",
            "grade": "Level 1",
        }
    }
}
"""
def load_jsonl(file):
    data = []
    with open(file, "r") as f:
        for line in f:
            data.append(json.loads(line))
    return data

test_data = load_jsonl("./test.jsonl")
testmini_ids = [example['id'] for example in load_jsonl("./testmini.jsonl")]

output = {}

for i in test_data:
    newline = {}
    newline["question"] = i["question"]
    newline["image"] = i["image"]
    newline["choices"] = i["options"]
    newline["answer"] = i["answer"]
    newline["question_type"] = "multi_choice" if i["options"] else "free_form"
    newline["pid"] = i["id"]
    newline["metadata"] = {
        "split": "testmini" if i['id'] in testmini_ids else "test",
        "category": i["subject"],
        "grade": f'level {i["level"]}'
        }
    output[i["id"]] = newline

with open("./data_public.js", "w") as f:
    f.write("test_data = ")
    json.dump(output, f, indent=4, ensure_ascii=False)