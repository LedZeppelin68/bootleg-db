import os
import json

def generate_index_json(folder_path):
    index_data = []

    for filename in os.listdir(folder_path):
        if not filename.endswith('.json') or filename == 'index.json':
            continue

        file_path = os.path.join(folder_path, filename)
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            entry = {
                "ID": data.get("ID"),
                "Artist": data.get("Artist"),
                "Date": data.get("Date"),
                "Venue": data.get("Venue"),
                "Source": data.get("Source"),
                "Lineage": data.get("Lineage")
            }

            # Добавим имя файла для отладки или ссылки (опционально)
            entry["file"] = filename

            index_data.append(entry)

        except Exception as e:
            print(f"Ошибка при обработке файла {filename}: {e}")

    # Сохраняем index.json
    output_path = os.path.join(folder_path, 'index.json')
    with open(output_path, 'w', encoding='utf-8') as out_file:
        json.dump(index_data, out_file, indent=2, ensure_ascii=False)

    print(f"index.json успешно создан: {output_path}")


# 🔁 Вызов с текущей директорией, можно заменить на путь к нужной
if __name__ == "__main__":
    generate_index_json(".")
