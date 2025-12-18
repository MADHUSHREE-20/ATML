# ATMLimport os
import shutil
from pathlib import Path
from datetime import datetime
import json

class FileManager:
    def __init__(self, base_path="."):
        self.base_path = Path(base_path).resolve()
        self.current_path = self.base_path
        self.history = []
        
    def clear_screen(self):
        os.system('cls' if os.name == 'nt' else 'clear')
    
    def display_header(self):
        print("=" * 70)
        print("PROJECT FILE MANAGEMENT CONSOLE".center(70))
        print("=" * 70)
        print(f"Current Directory: {self.current_path}")
        print("-" * 70)
    
    def list_files(self):
        try:
            items = list(self.current_path.iterdir())
            items.sort(key=lambda x: (not x.is_dir(), x.name.lower()))
            
            if not items:
                print("  (Empty directory)")
                return
            
            print(f"{'Type':<8} {'Name':<35} {'Size':<12} {'Modified'}")
            print("-" * 70)
            
            for item in items:
                item_type = "[DIR]" if item.is_dir() else "[FILE]"
                name = item.name[:32] + "..." if len(item.name) > 35 else item.name
                
                if item.is_file():
                    size = self.format_size(item.stat().st_size)
                    modified = datetime.fromtimestamp(item.stat().st_mtime).strftime('%Y-%m-%d %H:%M')
                else:
                    size = "-"
                    modified = "-"
                
                print(f"{item_type:<8} {name:<35} {size:<12} {modified}")
        
        except PermissionError:
            print("  Error: Permission denied")
    
    def format_size(self, size):
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"
    
    def change_directory(self, path):
        try:
            if path == "..":
                new_path = self.current_path.parent
            elif path == "~":
                new_path = Path.home()
            else:
                new_path = (self.current_path / path).resolve()
            
            if new_path.is_dir():
                self.history.append(self.current_path)
                self.current_path = new_path
                print(f"Changed to: {self.current_path}")
            else:
                print("Error: Not a directory")
        except Exception as e:
            print(f"Error: {e}")
    
    def create_file(self, filename):
        try:
            file_path = self.current_path / filename
            file_path.touch()
            print(f"Created file: {filename}")
        except Exception as e:
            print(f"Error: {e}")
    
    def create_directory(self, dirname):
        try:
            dir_path = self.current_path / dirname
            dir_path.mkdir(parents=True, exist_ok=False)
            print(f"Created directory: {dirname}")
        except FileExistsError:
            print("Error: Directory already exists")
        except Exception as e:
            print(f"Error: {e}")
    
    def delete_item(self, name):
        try:
            item_path = self.current_path / name
            if not item_path.exists():
                print("Error: Item does not exist")
                return
            
            confirm = input(f"Delete '{name}'? (yes/no): ").lower()
            if confirm == 'yes':
                if item_path.is_dir():
                    shutil.rmtree(item_path)
                else:
                    item_path.unlink()
                print(f"Deleted: {name}")
            else:
                print("Deletion cancelled")
        except Exception as e:
            print(f"Error: {e}")
    
    def copy_item(self, src, dst):
        try:
            src_path = self.current_path / src
            dst_path = self.current_path / dst
            
            if not src_path.exists():
                print("Error: Source does not exist")
                return
            
            if src_path.is_dir():
                shutil.copytree(src_path, dst_path)
            else:
                shutil.copy2(src_path, dst_path)
            
            print(f"Copied '{src}' to '{dst}'")
        except Exception as e:
            print(f"Error: {e}")
    
    def move_item(self, src, dst):
        try:
            src_path = self.current_path / src
            dst_path = self.current_path / dst
            
            if not src_path.exists():
                print("Error: Source does not exist")
                return
            
            shutil.move(str(src_path), str(dst_path))
            print(f"Moved '{src}' to '{dst}'")
        except Exception as e:
            print(f"Error: {e}")
    
    def search_files(self, pattern):
        print(f"\nSearching for: {pattern}")
        print("-" * 70)
        found = False
        
        for item in self.current_path.rglob(f"*{pattern}*"):
            relative = item.relative_to(self.current_path)
            item_type = "[DIR]" if item.is_dir() else "[FILE]"
            print(f"{item_type} {relative}")
            found = True
        
        if not found:
            print("No items found")
    
    def show_info(self, name):
        try:
            item_path = self.current_path / name
            if not item_path.exists():
                print("Error: Item does not exist")
                return
            
            stat = item_path.stat()
            print(f"\nInformation for: {name}")
            print("-" * 50)
            print(f"Type: {'Directory' if item_path.is_dir() else 'File'}")
            print(f"Size: {self.format_size(stat.st_size)}")
            print(f"Created: {datetime.fromtimestamp(stat.st_ctime).strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"Modified: {datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"Full Path: {item_path.resolve()}")
        except Exception as e:
            print(f"Error: {e}")
    
    def show_menu(self):
        print("\nCommands:")
        print("  ls              - List files and directories")
        print("  cd <path>       - Change directory")
        print("  mkdir <name>    - Create directory")
        print("  touch <name>    - Create file")
        print("  rm <name>       - Delete file/directory")
        print("  cp <src> <dst>  - Copy file/directory")
        print("  mv <src> <dst>  - Move/rename file/directory")
        print("  search <name>   - Search for files")
        print("  info <name>     - Show item information")
        print("  clear           - Clear screen")
        print("  help            - Show this menu")
        print("  exit            - Exit console")
    
    def run(self):
        self.clear_screen()
        print("Welcome to Project File Management Console!")
        print("Type 'help' for available commands\n")
        
        while True:
            try:
                self.display_header()
                command = input("\n> ").strip().split(maxsplit=2)
                
                if not command:
                    continue
                
                cmd = command[0].lower()
                
                if cmd == "exit":
                    print("Goodbye!")
                    break
                elif cmd == "ls":
                    self.list_files()
                elif cmd == "cd" and len(command) > 1:
                    self.change_directory(command[1])
                elif cmd == "mkdir" and len(command) > 1:
                    self.create_directory(command[1])
                elif cmd == "touch" and len(command) > 1:
                    self.create_file(command[1])
                elif cmd == "rm" and len(command) > 1:
                    self.delete_item(command[1])
                elif cmd == "cp" and len(command) > 2:
                    self.copy_item(command[1], command[2])
                elif cmd == "mv" and len(command) > 2:
                    self.move_item(command[1], command[2])
                elif cmd == "search" and len(command) > 1:
                    self.search_files(command[1])
                elif cmd == "info" and len(command) > 1:
                    self.show_info(command[1])
                elif cmd == "clear":
                    self.clear_screen()
                elif cmd == "help":
                    self.show_menu()
                else:
                    print("Invalid command. Type 'help' for available commands.")
                
                input("\nPress Enter to continue...")
                self.clear_screen()
                
            except KeyboardInterrupt:
                print("\nUse 'exit' command to quit")
            except Exception as e:
                print(f"Error: {e}")
                input("\nPress Enter to continue...")

if __name__ == "__main__":
    fm = FileManager()
    fm.run()