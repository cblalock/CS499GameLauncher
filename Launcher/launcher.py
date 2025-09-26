import tkinter as tk
import subprocess
import os

def launch_game(path):
    """Launch a game if it exists."""
    if os.path.exists(path):
        subprocess.Popen(path)
    else:
        print(f"Game not found:", path)

def load_game_image(path, max_width=150, max_height=150):
    """Load a PNG and scale it down to fit max_width/max_height."""
    img = tk.PhotoImage(file=path)
    subsample_x = max(1, img.width() // max_width)
    subsample_y = max(1, img.height() // max_height)
    return img.subsample(subsample_x, subsample_y)

def main():
    root = tk.Tk()
    root.title("Game Launcher")
    root.geometry("900x600")
    root.configure(bg="#1e1e1e")

    # Sidebar
    sidebar = tk.Frame(root, bg="#252526", width=150, height=600)
    sidebar.pack(side="left", fill="y")

    tk.Label(sidebar, text="MENU", fg="white", bg="#252526", font=("Arial", 12, "bold")).pack(pady=10)
    tk.Button(sidebar, text="Library", bg="#3a3a3a", fg="white",
              relief="flat", width=15, height=2).pack(pady=5)
    tk.Button(sidebar, text="Settings", bg="#3a3a3a", fg="white",
              relief="flat", width=15, height=2).pack(pady=5)
    tk.Button(sidebar, text="Exit", bg="#3a3a3a", fg="white",
              relief="flat", width=15, height=2,
              command=root.quit).pack(pady=5)

    # Main area
    main_frame = tk.Frame(root, bg="#1e1e1e")
    main_frame.pack(side="right", expand=True, fill="both")

    tk.Label(main_frame, text="Iron City Interactive", fg="white", bg="#1e1e1e",
             font=("Arial", 16, "bold")).pack(pady=10)

    # Horizontal container for games
    games_row = tk.Frame(main_frame, bg="#1e1e1e")
    games_row.pack(pady=20)

    # List of games
    games = [
        {"name": "First Game", "path": "Games/FirstGameFolder/FirstGame.exe", "icon": "game1.png"},
        {"name": "Second Game", "path": "Games/SecondGameFolder/SecondGame.exe", "icon": "game2.png"},
        # Add more games here
    ]

    # Keep references to images
    root.game_images = []

    for game in games:
        # Frame for each game
        game_frame = tk.Frame(games_row, bg="#1e1e1e")
        game_frame.pack(side="left", padx=15)

        # Image as a button
        img = load_game_image(game["icon"], max_width=150, max_height=150)
        btn = tk.Button(game_frame, image=img, bg="#1e1e1e", relief="flat",
                        command=lambda p=game["path"]: launch_game(p))
        btn.pack()
        
        # Game title under the image
        tk.Label(game_frame, text=game["name"], fg="white", bg="#1e1e1e",
                 font=("Arial", 12, "bold")).pack(pady=5)

        root.game_images.append(img)  # keep reference

    root.mainloop()

if __name__ == "__main__":
    main()