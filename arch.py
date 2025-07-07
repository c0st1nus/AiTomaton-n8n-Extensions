import tarfile
import os
import argparse

def create_fast_archive(source_path: str, output_filename: str):
    """
    Быстро создаёт несжатый tar-архив, копируя исходную папку
    внутрь структуры './custom/AiTomaton/'.

    Args:
        source_path (str): Путь к исходной папке для архивации.
        output_filename (str): Имя конечного tar-архива.
    """
    # 1. Проверка существования исходной папки
    if not os.path.isdir(source_path):
        print(f"Исходная папка не найдена по пути '{source_path}'")
        return

    # Убедимся, что имя выходного файла имеет расширение .tar
    if not output_filename.endswith('.tar'):
        output_filename += '.tar'

    try:
        # 2. Создание архива без сжатия
        with tarfile.open(output_filename, "w:") as tar:
            # 3. Определение пути внутри архива
            base_folder_name = os.path.basename(os.path.normpath(source_path))
            archive_target_path = os.path.join("custom", "AiTomaton", base_folder_name)

            # 4. Добавление папки в архив
            tar.add(source_path, arcname=archive_target_path)

            print("Done")

    except Exception as e:
        print(f"e")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Быстрое создание несжатого TAR-архива с вложенной структурой './custom/AiTomaton/'.",
        epilog="Пример: python arch.py ./my_app_folder my_archive"
    )

    # ИЗМЕНЕНИЕ ЗДЕСЬ: Используем nargs='?' и убираем required=False
    parser.add_argument(
        "source_folder",
        type=str,
        nargs='?', # Позволяет аргументу отсутствовать
        default="./dist",
        help="Путь к исходной папке (по умолчанию: './dist')."
    )

    # И ИЗМЕНЕНИЕ ЗДЕСЬ: Аналогично для второго аргумента
    parser.add_argument(
        "output_file",
        type=str,
        nargs='?', # Позволяет аргументу отсутствовать
        default="custom",
        help="Имя для .tar архива (по умолчанию: 'archive')."
    )

    args = parser.parse_args()
    create_fast_archive(args.source_folder, args.output_file)
