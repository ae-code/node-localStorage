describe("Test suite for Storage class", function() {
    var fs = require('fs');
    var StorageModule = require('../src/localStorage.js');
    var Storage = StorageModule.Storage;

    var storage;
    beforeEach(function() {
	storage = new Storage();
    });

    it("is present in localStorage.js", function() {
	expect(Storage).toBeDefined();
    });

    it ("is empty when created", function() {
	expect(storage.length).toBe(0);
    });

    it ("can add items via setItem() and get via getItem()", function() {
	storage.setItem("a","b");
	expect(storage.length).toBe(1);

	expect(storage.getItem("a")).toBe("b");
    });

    it ("casts non-string keys and values", function() {
	storage.setItem(["boo"],"a");
	expect(storage.length).toBe(1);

	storage.setItem("a",[]);
	expect(storage.length).toBe(2);

	storage.setItem("b", 1);
	expect(storage.length).toBe(3);
	expect(storage.getItem("b")).toBe("1");

	storage.setItem("a","b");
	expect(storage.length).toBe(3);
    });

    it ("upates existing values with setItem()", function() {
	storage.setItem("x","y");
	storage.setItem("x","z");
	expect(storage.getItem("x")).toBe("z");
	expect(storage.length).toBe(1);
    });

    it ("returns null for non-existent keys", function() {
	storage.setItem("x","y");
	expect(storage.getItem("nope")).toBeNull();
    });

    it ("clears data when clear() is called", function() {
	storage.setItem("a","1");
	storage.setItem("b","2");
	storage.clear();
	expect(storage.length).toBe(0);
	expect(storage.getItem("a")).toBeNull();
    });

    it ("can remove items", function() {
	storage.setItem("a", "1");
	storage.setItem("b", "2");
	storage.removeItem("a");
	expect(storage.length).toBe(1);
	expect(storage.getItem("a")).toBeNull();
	expect(storage.getItem("b")).toBe("2");
    });

    it ("returns null for invalid indices", function() {
	storage.setItem("a", "1");
	storage.setItem("b", "2");
	storage.setItem("c", "3");
	expect(storage.key(-1)).toBeNull();
	expect(storage.key(3)).toBeNull();
	expect(storage.key(1)).toBe("b");
    });

    it ("can get and set existing values through properties", function() {
	storage.setItem("a", "1");
	expect(storage.a).toBe("1");

	storage.a = "2";
	expect(storage.a).toBe("2");
    });

    it ("can add new values through properties", function() {
	storage.a = "1";
	expect(storage.length).toBe(1);
    });

    it ("does not allow length to be changed manually", function() {
	storage.lenght = 5;
	expect(storage.length).toBe(0);
    });

    it ("can create persistent storage", function() {
	var filename = '/tmp/localStorageTest1';
	try {
	    fs.unlinkSync(filename);
	}
	catch (e) { }
	
	var pstorage = new Storage(filename);
	pstorage.item1 = "ABC";
	pstorage.item2 = "DEF";

	StorageModule._forceSave(pstorage);
	
	var raw = null;
	try {
	    raw = fs.readFileSync(filename);
	}
	catch(e) {
	    console.log(e);
	    expect(e).toBeNull();
	}

	expect(raw.toString()).toBe("{\"item1\":\"ABC\",\"item2\":\"DEF\"}");
    });

    it ("can load persistent storage", function() {
	var filename = '/tmp/localStorageTest2';
	try {
	    fs.writeFileSync(filename, "{\"itemA\":\"1\",\"itemB\":\"2\"}");
	}
	catch (e) { }
	
	var pstorage = new Storage(filename);
	expect(pstorage.itemA).toBe("1");
	expect(pstorage.itemB).toBe("2");
	pstorage.setItem("itemB", "2A");
	pstorage.setItem("itemC", "3");

	StorageModule._forceSave(pstorage);
	
	var raw = null;
	try {
	    raw = fs.readFileSync(filename);
	}
	catch(e) {
	    console.log(e);
	    expect(e).toBeNull();
	}

	expect(raw.toString()).toBe("{\"itemA\":\"1\",\"itemB\":\"2A\",\"itemC\":\"3\"}");
    });
});