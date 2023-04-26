class Item():
    def __init__(self, item_name):
        self.name = item_name
        self.description = None
       
    def set_description(self, item_description):
        self.description = item_description
       
    def get_description(self):
        return self.description
       
    def describe(self):
        print("There is a " + self.name + ". " + self.description + ".")
       
    def set_name(self, item_name):
        self.name = item_name
   
    def get_name(self):
        return self.name
   
    def get_details(self):
        print("")
        print(self.name)
        line = ""
        for letter in self.name:
            line += "`"
        print(line)
        print(self.description)
        print("")
