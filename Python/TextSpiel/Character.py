class Character():
 
    # Create a character
    def __init__(self, char_name, char_description):
        self.name = char_name
        self.description = char_description
        self.conversation = None
        self.energy = None
 
    # Describe this character
    def describe(self):
        print( self.name + " is here!" )
        print( self.description )
 
    # Set what this character will say when talked to
    def set_conversation(self, conversation):
        self.conversation = conversation
 
    # Talk to this character
    def talk(self):
        if self.conversation is not None:
            print("[" + self.name + " says]: " + self.conversation)
        else:
            print(self.name + " doesn't want to talk to you")
 
    # Fight with this character
    def fight(self, combat_item):
        print(self.name + " doesn't want to fight with you")
        return True

    def hug(self):
        print(self.name + " hugged you")
       
class Enemy(Character):
    def __init__(self, char_name, char_description):
        super().__init__(char_name, char_description)
        self.weakness = None
       
    def set_weakness(self, enemy_weakness):
        self.weakness = enemy_weakness
       
    def get_weakness(self):
        return self.weakness

    def set_energy(self, enemy_energy):
        self.energy = enemy_energy

    def get_energy(self):
        return self.energy
   
    def fight(self, combat_item):
        if combat_item == self.weakness:
            print()
            print("You easily repel " + self.name + " with your trusty " + combat_item + ". Nice one.")
            return True
        else:
            return False
