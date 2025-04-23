import json
from openai import OpenAI
import time

client = OpenAI(
    api_key="OPENAI_API_KEY",
    base_url="https://api.openai.com/v1"
)

with open("./data/tavi_abstract.json", "r", encoding="utf-8") as f:
    data = json.load(f)

abstracts = [item['abstract'] for item in data]
print(len(abstracts))

results = []

for idx, item in enumerate(data):
    raw_text = item.get("abstract", "")
    if not isinstance(raw_text, str):
        raw_text = str(raw_text)
    text = raw_text.strip()

    if not text:
        print(f"[{idx}] Skipped empty abstract")
        continue

    try:
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        embedding = response.data[0].embedding
        results.append({
            "id": item["id"],
            "title": item["title"],
            "embedding": embedding
        })
        print(f"[{idx+1}/{len(data)}] Embedded ID {item['id']}")
        time.sleep(0.5)  # 避免 rate limit
    except Exception as e:
        print(f"Error at ID {item['id']}: {e}")
        continue

# 保存向量结果
with open("./data/tavi_abstract_embeddings.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("✅ Embedding generation complete.")
