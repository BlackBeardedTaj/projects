import weakref

class MyClass():

    _instances = set()

    def __init__(self, name, description):
        self.name = name
        self.description = description
        self._instances.add(weakref.ref(self))
        self.type = None

    @classmethod
    def getinstances(cls):
        dead = set()
        for ref in cls._instances:
            obj = ref()
            if obj is not None:
                if obj.type != "2": 
                    yield obj
            else:
                dead.add(ref)
        cls._instances -= dead

    def set_item_type(self, item_type):
        self.type = item_type

    def get_item_type(self):
        return self.type


a = MyClass("a", "Testing a way to enhance a memory management by making a reference count\n\
to point out to Python's 'garbage collection' process what can be deleted \n\
in order to free up some memory.")
b = MyClass("b", "Something")
c = MyClass("c", "Something special")

a.set_item_type("1")
b.set_item_type("1")
c.set_item_type("2")

for obj in MyClass.getinstances():
    print (obj.name + "\n" + obj.description) # prints 'a' only
