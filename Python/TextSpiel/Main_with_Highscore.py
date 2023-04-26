from Room import Room
from Item import Item
from Character import Character, Enemy
import random, time, glob, pickle

# Funktion HS lesen
def hs_lesen():
    # Liste wird hier erzeugt
    global hs_liste

    # Kein Highscore vorhanden, leere Liste
    if not glob.glob("highscore.bin"):
        hs_liste = []
        return

    # Highscore vorhanden, laden
    d = open("highscore.bin", "rb")
    hs_liste = pickle.load(d)
    d.close

# Funktion HS anzeigen
def hs_anzeigen():
    # Highscore nicht vorhanden
    if not hs_liste:
        print("No Highscore available")
        return

    # Ausgabe HS
    print(" P. Name        Time")
    for i in range(len(hs_liste)):
        print(f"{i+1:2d}. {hs_liste[i][0]:10} {hs_liste[i][1]:5.2f} sec")
        if i >= 9:
            break

# Funktion HS schreiben
def hs_schreiben():
    # Zugriff
    d = open("highscore.bin","wb")
    pickle.dump(hs_liste,d)
    d.close

# Funktion Spiel
def spiel():
    # Eingabe des Namens
    name = input("Please write your name (max. 10 Characters): ")
    name = name[0:10]
    print("\n\n")
    # Initialisierung Zeit
    startzeit = time.time()

    # Spiel
    kitchen = Room("Kitchen")
    kitchen.set_description("A bright and colorful room full of shiny expensive appliences. \n\
There is an axe lying on top of the equally expensive marble mobile island.")
     
    dining_room = Room("Dining Room")
    dining_room.set_description("A dingy room with a large mahogany table with candles on either side of it.\n\
In the corner of the room there is a chest of drawers, wait, \n\
something is sticks out behind it. OH, IT'S A FLAME THROWER!")
     
    ballroom = Room("Ballroom")
    ballroom.set_description("A lavishly decorated room with ostentatious furniture and long, floor-to-ceiling windows.\n\
There's an expensive-looking glass table in the right corner of the room \n\
and a....oh really, what's this dirty olde sock doing under it? It's full of coins, strange...")

    kitchen.link_room(dining_room, "south")
    dining_room.link_room(kitchen, "north")
    dining_room.link_room(ballroom, "west")
    ballroom.link_room(dining_room, "east")

    pen = Item("pen")
    pen.set_description("Wooden pen")
     
    flame = Item("flamethrower")
    flame.set_description("Can't think of a better reason to take out my bag of marshmallows")
     
    axe = Item("axe")
    axe.set_description("Small but very sharp. Fits perfectly between the eyes of any 'philanthropist'")
     
    sock = Item("sock")
    sock.set_description("A stinky old sock, full of someone else's loose change. \
     Just don't get in it's way, it can hit you hard.\
     Watch out, those coins can attract some corrupt politicians.")
     
    every = Enemy("Every S. Ingleone", "A currupt politician")
    every.set_conversation("Actually, we can make a deal if you give me...")
    every.set_weakness("sock")
    every.set_energy("1")
    dining_room.set_character(every)
     
    ph = Enemy("Phill Hates", "An unscrupulous hypocritical 'philantropist'")
    ph.set_conversation("All you need is lab...oh, you caught me singing again...yeah, I just bought some stolen Indian land...can't hide happiness")
    ph.set_weakness("axe")
    ph.set_energy("1")
    kitchen.set_character(ph)
     
    waste = Enemy("Banker", "A representative of any capitalist in the world")
    waste.set_conversation("Economic depression, more repression, your posession is my P(o)A(sse)SSION")
    waste.set_weakness("flamethrower")
    waste.set_energy("1")
    ballroom.set_character(waste)

    kitchen.set_item([pen, axe])
    ballroom.set_item([sock, flame])
    dining_room.set_item(pen)
     
    print("Enter a mysterious villa, find hidden weapons and engage in combat\n\
with some of the most gruesome and treacherous villains that modern times have to offer. \n\
Type a direction to move between rooms, 'talk' to speak to the people in the rooms, \n\
'item' to inspect and pick up weapons and 'fight' to fight your enemies!")
     
    inventory = []
    current_room = kitchen
    score = 0
    hug_versuch = 0
    dead = False
    defeated = False
    defeated_enemies = []

    rooms = [kitchen, dining_room, ballroom]
    all_enemies = []
    for r in rooms:

        # TODO
        e = r.get_character()
        if isinstance(e, Enemy):
            all_enemies.append(e)

    while dead == False:
        print()
        current_room.get_details()
        inhabitant = current_room.get_character()
        room_item = current_room.get_item()
        if inhabitant is not None:
            inhabitant.describe()
        print()
        
        # Alle Feinde im Spiel (überprüfung)
##        print(len(all_enemies))

        # Eingabe
        command = input("> ")
        if command.lower() in ["north", "south", "east", "west"]:
            current_room = current_room.move(command)
        elif command == "talk":
            if inhabitant is not None:
                inhabitant.talk()
            else:
                print("There's no one to talk to here. Well this is embarrassing...")
                
        # Das Inventarsystem
        elif command.lower() == "item":
            if room_item is not None:
                if_list = type(room_item) == list
                if if_list == True:
                    room_item_backup = []
                    room_item_backup_names = []
                    for i in room_item:
                        i.get_details()
                        room_item_backup.append(i)
                        room_item_backup_names.append(i.name)

                    if len(room_item_backup_names)>1:
                        what_item = input("What item do you wanna take?\n" + "> ")
                        wi = what_item.lower()

                        if wi in room_item_backup_names:
                            room_item.clear()
                            ribn = room_item_backup_names.index(wi)
                            inventory.append(room_item_backup_names[ribn])
                            print('\n' + 'Inventory: ', end='\r')
                            print(inventory)
                            del room_item_backup_names[ribn]
                            for i in room_item_backup:
                                a = i.name
                                if a.lower() in room_item_backup_names:
                                    room_item.append(i)
                            del room_item_backup
                            del room_item_backup_names

                        else:
                            print("You didn't take anything!")                          
                             
                    elif len(room_item) == 1:
                        pickup = input("Do you want to pick this up?\n" + "> ")
                        if pickup.lower() == "yes":
                                for i in room_item:
                                    inventory.append(i.name)
                                    print('\n' + 'Inventory: ', end='\r')
                                    print(inventory)
                                    room_item.remove(i)
                        else:
                            print("No " + str(i.name) + " for you, then!")
                    else:
                        print("Nothing to see here!")
                else:

                    room_item.get_details()
                    pickup = input("Do you want to pick this up?\n" + "> ")
                    if pickup.lower() == "yes":
                        inventory.append(room_item.name)
                        print(inventory)
                        current_room.set_item(None)
                    else:
                        print("No " + str(room_item.name) + " for you, then!")
            else:
                print("Nothing to see here!")
                
        # Zeige das Inventar
        elif command.lower() == "inventory":
            print(inventory)

        # den Feind bekämpfen
        elif command.lower() == "fight":
            if inhabitant is not None:
                
                # Wähle eine Waffe
                if isinstance(inhabitant, Enemy):
                    print()
                    weapon = input("What do you want to fight with?\
                        \nYou have: " + str(inventory) + "\n>")
                    if weapon.lower() not in inventory:
                        print("You don't have this! Pick something else!")
                    else:
                        
                        # Wenn die richtige Waffe gewählt ist (Wenn die Waffe schädlich für den Feind ist)
                        if inhabitant.fight(weapon) == True:
                            score += 1
                            full_energy = inhabitant.get_energy()
                            enemy_energy = int(full_energy) - 1
                            print("Enemy energy is " + str(enemy_energy) + " from " + full_energy + ".")
                            print("Your score is " + str(score) + ".")

                            # Wenn der Feind besiegt ist
                            if enemy_energy == 0:
                                print("Bravo! You defeted the enemy!")
                                defeated_enemies.append(inhabitant)
                                current_room.set_character(None)
                                defeated = True
                                
                        # Der Spieler hat verloren im Kampf mit dem Gegner        
                        else:
                            dead = True
                            print("Game over! Your score was " + str(score) + ".")

                # Der Spielcharacter im Zimmer is kein Feind
                else:
                    print("I don't see any enemies here.")
            else:
                print("There's noone here!!!")
        elif command.lower() == "hug":
            
        # Wenn keiner im Zimmer ist
            if inhabitant == None:
                print("There is no one here to hug :-(")
            else:
                
                # Wenn der Spielcaracter im Zimmer der Feind ist
                if isinstance(inhabitant, Enemy):
                    
                    # Umarmung mit 3 Versuchen, nach dem dritten Fehlversuch => Game Over
                    hug_versuch = hug_versuch + 1
                    if hug_versuch in range(1,3):
                        print("I wouldn't do that if I were you...")
                    else:
                        print("You have been warned.")
                        print("That's the end of the game!")
                        print("Your score was " + str(score) + ".")
                        dead = True
                        
                # ...im gegenteil ist der Spielcharacter ein Freund, umarme ihn.
                else:
                    inhabitant.hug()
                    
        else:
            print("I don't understand")

        # Die Anzahl der Feinde
        ae = len(all_enemies)
        
        # Die Anzahl der besiegten Feinde
        de = len(defeated_enemies)
        
        # Liste der Feinde (zum Anzeigen)
        print("----------")
        rooms = [kitchen, dining_room, ballroom]
        for i in rooms:
            r = i.get_character()
            if r != None:
                lu = print(r.name + " lurking")

        for i in defeated_enemies:
            print(i.name + " defeated")

        if de == ae:
            break
                        
    # Auswertung
    endzeit = time.time()
    differenz = endzeit - startzeit
    
    # Number of All enemies
    ae = len(all_enemies)
    # Number of Defeated enemies
    de = len(defeated_enemies)
    
    # Auswertung
    print()
    print(f"Ergebnis: {de:d} von {ae:d} in {differenz:.2f} Sekunden", end = "")
    if de == ae:
        print("\n\n")
        print(", Highscore")
    else:
        print(", leider kein Highscore")
        return

    # Minuten in Liste schreiben
    gefunden = False
    for i in range(len(hs_liste)):
        # Einsetzen in Liste
        if differenz < hs_liste[i][1]:
            hs_liste.insert(i, [name, differenz])
            gefunden = True
            break

    # Ans Ende der Liste schreiben
    if not gefunden:
        hs_liste.append([name, differenz])

    # Highscore-Liste anzeigen
    hs_anzeigen()

# Hauptprogramm

# Initialisierung Zufallsgenerator
random.seed()

# Highscore aus Datei in Liste lesen
hs_lesen()

# Endlosschleife
while True:
    # Hauptmanu, Auswahl
    try:
        menu = int(input("Please choose a number (0: Exit, 1: Highscore, 2: Play): "))
    except:
        print("You made a mistake. That's O.K., it happens. Choose one of these numbers: 0, 1 and 2!")
        continue

    # Aufruf einer Funktion oder Ende
    if menu == 0:
        break
    elif menu == 1:
        hs_anzeigen()
    elif menu == 2:
        spiel()
    else:
        print("incorrect number. Choose one of these numbers: 0, 1 and 2!")

# Highscore aus Liste in Datei schreiben
hs_schreiben()










