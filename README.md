# Design Patterns in TypeScript

This document provides a comprehensive guide to common design patterns in TypeScript. It is organized into three sections:

- [Creational Design Patterns](#creational-design-patterns)
- [Structural Design Patterns](#structural-design-patterns)
- [Behavioral Design Patterns](#behavioral-design-patterns)

Each pattern includes:

- **Intent & Problem Solved**
- **Common Use Cases**
- **Basic Structure**
- **TypeScript Code Example**
- **Pros & Cons**
- **Mnemonic / Memory Aid**

---

## Creational Design Patterns

### 1. Factory Method

**Intent & Problem Solved:**  
When a class can’t anticipate the type of objects it must create, the **Factory Method** lets subclasses decide which concrete class to instantiate.

- **Common Use Cases:** Creating platform-specific UI elements, different types of notifications, or any scenario where the creation process needs to be delegated to subclasses.

**Basic Structure:**

- **Creator (abstract class/interface):** Declares the factory method.
- **Concrete Creators:** Override the factory method to produce concrete products.
- **Product (interface):** Common interface for all created objects.

**TypeScript Example:**

```typescript
// Product interface
interface Button {
  render(): void;
}

// Concrete Products
class WindowsButton implements Button {
  render(): void {
    console.log('Rendering a Windows button');
  }
}

class MacButton implements Button {
  render(): void {
    console.log('Rendering a Mac button');
  }
}

// Creator abstract class
abstract class Dialog {
  // The factory method
  abstract createButton(): Button;

  renderDialog(): void {
    const button = this.createButton();
    button.render();
  }
}

// Concrete Creators
class WindowsDialog extends Dialog {
  createButton(): Button {
    return new WindowsButton();
  }
}

class MacDialog extends Dialog {
  createButton(): Button {
    return new MacButton();
  }
}

// Client code
function runDialog(dialog: Dialog) {
  dialog.renderDialog();
}

runDialog(new WindowsDialog());
runDialog(new MacDialog());
```

**Pros & Cons:**

- **Pros:**
  - Decouples client code from specific classes.
  - Promotes extensibility.
- **Cons:**
  - May lead to many small classes.
  - Can be overkill for simple object creation needs.

**Mnemonic / Memory Aid:**  
_"Think of a **factory** where each branch decides how to build its own product. When you see a creation problem that needs branch-specific behavior, Factory Method is your go-to."_

---

### 2. Abstract Factory

**Intent & Problem Solved:**  
Provides an interface for creating families of related or dependent objects without specifying their concrete classes.

- **Common Use Cases:** Designing cross-platform UI toolkits (Windows, macOS, Linux), or any situation where a suite of related products must be used together.

**Basic Structure:**

- **Abstract Factory:** Declares methods to create each product.
- **Concrete Factories:** Implement these methods to produce product families.
- **Abstract Products:** Interfaces for each kind of product.
- **Concrete Products:** Implement the abstract products.

**TypeScript Example:**

```typescript
// Abstract Products
interface Button {
  render(): void;
}

interface Checkbox {
  render(): void;
}

// Concrete Products for Windows
class WindowsButton implements Button {
  render(): void {
    console.log('Rendering a Windows button');
  }
}

class WindowsCheckbox implements Checkbox {
  render(): void {
    console.log('Rendering a Windows checkbox');
  }
}

// Concrete Products for macOS
class MacButton implements Button {
  render(): void {
    console.log('Rendering a Mac button');
  }
}

class MacCheckbox implements Checkbox {
  render(): void {
    console.log('Rendering a Mac checkbox');
  }
}

// Abstract Factory
interface GUIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

// Concrete Factories
class WindowsFactory implements GUIFactory {
  createButton(): Button {
    return new WindowsButton();
  }
  createCheckbox(): Checkbox {
    return new WindowsCheckbox();
  }
}

class MacFactory implements GUIFactory {
  createButton(): Button {
    return new MacButton();
  }
  createCheckbox(): Checkbox {
    return new MacCheckbox();
  }
}

// Client Code
function renderUI(factory: GUIFactory) {
  const button = factory.createButton();
  const checkbox = factory.createCheckbox();
  button.render();
  checkbox.render();
}

renderUI(new WindowsFactory());
renderUI(new MacFactory());
```

**Pros & Cons:**

- **Pros:**
  - Guarantees that products from the same family are used together.
  - Adds consistency among product variants.
- **Cons:**
  - Adding new product families can be cumbersome.
  - Increases system complexity with additional classes.

**Mnemonic / Memory Aid:**  
_"An **Abstract Factory** is like a global store supplying a whole family of products. When you require a consistent suite of objects, think ‘global store’—that’s your Abstract Factory."_

---

### 3. Builder

**Intent & Problem Solved:**  
Separates the construction process of a complex object from its final representation.

- **Common Use Cases:** Building complex objects like customizable UI forms, configuration objects, or multi-step document generation.

**Basic Structure:**

- **Builder Interface:** Declares methods for creating parts of a product.
- **Concrete Builder:** Implements these steps.
- **Director (optional):** Orchestrates the building process.
- **Product:** The complex object being built.

**TypeScript Example:**

```typescript
// Product
class House {
  windows: number = 0;
  doors: number = 0;
  hasGarage: boolean = false;
}

// Builder Interface
interface HouseBuilder {
  buildWindows(): this;
  buildDoors(): this;
  buildGarage(): this;
  getHouse(): House;
}

// Concrete Builder
class ConcreteHouseBuilder implements HouseBuilder {
  private house: House = new House();

  buildWindows(): this {
    this.house.windows = 4;
    return this;
  }

  buildDoors(): this {
    this.house.doors = 2;
    return this;
  }

  buildGarage(): this {
    this.house.hasGarage = true;
    return this;
  }

  getHouse(): House {
    return this.house;
  }
}

// Director
class ConstructionEngineer {
  constructor(private builder: HouseBuilder) {}

  constructHouse(): House {
    return this.builder.buildWindows().buildDoors().buildGarage().getHouse();
  }
}

// Client Code
const builder = new ConcreteHouseBuilder();
const engineer = new ConstructionEngineer(builder);
const house = engineer.constructHouse();
console.log(house);
```

**Pros & Cons:**

- **Pros:**
  - Offers fine control over the construction process.
  - Can produce different representations using the same process.
- **Cons:**
  - Introduces extra classes.
  - Might be over-engineered for simple objects.

**Mnemonic / Memory Aid:**  
_"Think of **Builder** as constructing a Lego model. You add pieces step by step to form a complete structure. When your object needs to be assembled piece by piece, Builder is your pattern."_

---

### 4. Prototype

**Intent & Problem Solved:**  
Enables the creation of new objects by cloning an existing instance—useful when instantiation is costly.

- **Common Use Cases:** When object creation is resource-intensive or when you need to duplicate objects with similar properties (e.g., game object cloning).

**Basic Structure:**

- **Prototype Interface:** Declares a `clone()` method.
- **Concrete Prototype:** Implements the cloning method to duplicate itself.

**TypeScript Example:**

```typescript
interface Prototype<T> {
  clone(): T;
}

class Car implements Prototype<Car> {
  constructor(public brand: string, public model: string) {}

  clone(): Car {
    // For more complex objects, deep copy may be needed.
    return new Car(this.brand, this.model);
  }
}

// Client Code
const car1 = new Car('Toyota', 'Corolla');
const car2 = car1.clone();
console.log(car2);
```

**Pros & Cons:**

- **Pros:**
  - Can improve performance when object creation is expensive.
  - Supports dynamic configuration at runtime.
- **Cons:**
  - Cloning objects with complex (especially circular) references can be tricky.
  - Requires careful implementation of the clone method.

**Mnemonic / Memory Aid:**  
_"The **Prototype** is your cloning machine. When you need a quick copy of an object without reinventing it, remember: ‘Don’t build from scratch—clone it!’"_

---

### 5. Singleton

**Intent & Problem Solved:**  
Ensures a class has only one instance and provides a global point of access to it.

- **Common Use Cases:** Managing shared resources like configuration settings, logging, or caching.

**Basic Structure:**

- **Private Constructor:** Prevents direct instantiation.
- **Static Instance Property:** Holds the one instance.
- **Static Accessor Method:** Provides the global access point.

**TypeScript Example:**

```typescript
class Singleton {
  private static instance: Singleton;

  private constructor() {
    // Private constructor to prevent direct instantiation.
  }

  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  public someBusinessLogic() {
    console.log('Executing some business logic.');
  }
}

// Client Code
const singleton1 = Singleton.getInstance();
const singleton2 = Singleton.getInstance();
console.log(singleton1 === singleton2); // true
```

**Pros & Cons:**

- **Pros:**
  - Controlled access to a single instance.
  - Can simplify resource management.
- **Cons:**
  - Can hide dependencies and complicate testing.
  - Risk of misuse as a “global state” leading to tight coupling.

**Mnemonic / Memory Aid:**  
_"**Singleton** is the ‘one and only’—if your system demands that only one instance ever exists, think ‘only one allowed!’"_

---

## Structural Design Patterns

### 1. Adapter

**Intent & Problem Solved:**  
Converts the interface of a class into an interface clients expect, enabling classes with incompatible interfaces to work together.

- **Common Use Cases:**
  - Integrating legacy systems with new interfaces.
  - Allowing classes with incompatible interfaces to collaborate.
  - Bridging between third-party libraries and your application.

**Basic Structure:**

- **Target Interface:** The interface expected by the client.
- **Adaptee:** A class with an incompatible interface.
- **Adapter:** Implements the target interface and internally calls the adaptee.

**TypeScript Example:**

```typescript
// Target interface expected by the client
interface ITarget {
  request(): string;
}

// Adaptee with an incompatible interface
class Adaptee {
  specificRequest(): string {
    return "Adaptee's specific behavior";
  }
}

// Adapter that makes Adaptee compatible with ITarget
class Adapter implements ITarget {
  constructor(private adaptee: Adaptee) {}

  request(): string {
    return `Adapter transforms: ${this.adaptee.specificRequest()}`;
  }
}

// Client code using the adapter
function clientCode(target: ITarget) {
  console.log(target.request());
}

const adaptee = new Adaptee();
const adapter = new Adapter(adaptee);
clientCode(adapter);
```

**Pros & Cons:**

- **Pros:**
  - Enables integration of classes with incompatible interfaces.
  - Promotes code reuse by allowing legacy code to work with new systems.
- **Cons:**
  - Can add extra layers of abstraction.
  - Overuse might lead to a proliferation of small classes.

**Mnemonic / Memory Aid:**  
_"Think of an electrical adapter—just as it lets different plugs fit into a socket, the Adapter pattern makes incompatible interfaces work together."_

---

### 2. Bridge

**Intent & Problem Solved:**  
Decouples an abstraction from its implementation so that both can vary independently.

- **Common Use Cases:**
  - Separating an abstraction (like a remote control) from its implementation (such as different electronic devices).
  - Systems where both interface and implementation might evolve independently.

**Basic Structure:**

- **Abstraction:** Contains a reference to an implementation.
- **Implementor:** Defines the interface for implementation classes.
- **Concrete Implementors:** Provide specific implementations.

**TypeScript Example:**

```typescript
// Implementor interface
interface Device {
  turnOn(): void;
  turnOff(): void;
}

// Concrete Implementors
class TV implements Device {
  turnOn(): void {
    console.log('TV is on');
  }
  turnOff(): void {
    console.log('TV is off');
  }
}

class Radio implements Device {
  turnOn(): void {
    console.log('Radio is on');
  }
  turnOff(): void {
    console.log('Radio is off');
  }
}

// Abstraction
class RemoteControl {
  constructor(protected device: Device) {}

  togglePower(): void {
    console.log('Remote: toggling power.');
    this.device.turnOn();
    this.device.turnOff();
  }
}

// Client code
const tvRemote = new RemoteControl(new TV());
tvRemote.togglePower();

const radioRemote = new RemoteControl(new Radio());
radioRemote.togglePower();
```

**Pros & Cons:**

- **Pros:**
  - Separates abstraction from implementation, facilitating independent development.
  - Simplifies adding new abstractions or implementations.
- **Cons:**
  - May introduce additional complexity with more classes.
  - Requires careful design to avoid over-engineering.

**Mnemonic / Memory Aid:**  
_"Imagine a bridge spanning a river—separating the two banks (abstraction and implementation) so they can be built or modified independently. When you need to decouple two dimensions, think Bridge."_

---

### 3. Composite

**Intent & Problem Solved:**  
Composes objects into tree structures to represent part-whole hierarchies, allowing clients to treat individual objects and compositions uniformly.

- **Common Use Cases:**
  - Representing hierarchies such as file systems, organizational structures, or UI component trees.
  - Simplifying client code when working with complex tree structures.

**Basic Structure:**

- **Component Interface:** Declares operations for both simple and composite objects.
- **Leaf:** Represents end objects.
- **Composite:** Contains components (leaves or other composites) and implements operations accordingly.

**TypeScript Example:**

```typescript
// Component interface
interface Graphic {
  draw(): void;
}

// Leaf: a simple object
class Circle implements Graphic {
  draw(): void {
    console.log('Drawing a circle');
  }
}

// Composite: can hold other Graphics
class Group implements Graphic {
  private children: Graphic[] = [];

  add(graphic: Graphic): void {
    this.children.push(graphic);
  }

  draw(): void {
    console.log('Drawing a group:');
    this.children.forEach((child) => child.draw());
  }
}

// Client code
const circle1 = new Circle();
const circle2 = new Circle();
const group = new Group();
group.add(circle1);
group.add(circle2);
group.draw();
```

**Pros & Cons:**

- **Pros:**
  - Simplifies client interactions by treating single objects and compositions uniformly.
  - Facilitates the creation of complex, recursive structures.
- **Cons:**
  - Can make the design overly general, potentially compromising type safety.
  - May complicate the design if not all objects naturally fit into a tree structure.

**Mnemonic / Memory Aid:**  
_"Composite is like a collage—individual pieces (leaves) come together to form a complete picture (composite). When you have tree structures, Composite is your pattern."_

---

### 4. Decorator

**Intent & Problem Solved:**  
Dynamically adds responsibilities to objects without modifying their structure, providing a flexible alternative to subclassing.

- **Common Use Cases:**
  - Enhancing objects (e.g., adding scrollbars to windows, or extra features to coffee orders) at runtime.
  - Adding functionality to objects transparently without affecting other instances.

**Basic Structure:**

- **Component Interface:** Defines the methods that will be decorated.
- **Concrete Component:** The original object.
- **Decorator Base Class:** Wraps the component and conforms to the component interface.
- **Concrete Decorators:** Extend the decorator to add new behavior.

**TypeScript Example:**

```typescript
// Component interface
interface Coffee {
  cost(): number;
  description(): string;
}

// Concrete Component
class SimpleCoffee implements Coffee {
  cost(): number {
    return 2;
  }
  description(): string {
    return 'Simple coffee';
  }
}

// Decorator base class
class CoffeeDecorator implements Coffee {
  constructor(protected decoratedCoffee: Coffee) {}

  cost(): number {
    return this.decoratedCoffee.cost();
  }
  description(): string {
    return this.decoratedCoffee.description();
  }
}

// Concrete Decorators
class MilkDecorator extends CoffeeDecorator {
  cost(): number {
    return super.cost() + 0.5;
  }
  description(): string {
    return super.description() + ', with milk';
  }
}

class SugarDecorator extends CoffeeDecorator {
  cost(): number {
    return super.cost() + 0.3;
  }
  description(): string {
    return super.description() + ', with sugar';
  }
}

// Client code
let coffee: Coffee = new SimpleCoffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
console.log(coffee.description(), 'costs', coffee.cost());
```

**Pros & Cons:**

- **Pros:**
  - Provides a flexible way to extend functionality.
  - Avoids an explosion of subclasses.
- **Cons:**
  - Can lead to many small classes.
  - Debugging can be harder due to layers of wrapping.

**Mnemonic / Memory Aid:**  
_"Decorator is like gift wrapping—each layer adds a new feature without changing the original gift. When you need to add responsibilities dynamically, think Decorator."_

---

### 5. Facade

**Intent & Problem Solved:**  
Offers a simplified interface to a complex subsystem, making it easier for clients to interact with the system.

- **Common Use Cases:**
  - Simplifying complex libraries or APIs.
  - Reducing dependencies between subsystems and client code.
  - Providing a unified interface for various functionalities.

**Basic Structure:**

- **Subsystem Classes:** A set of classes that perform complex tasks.
- **Facade:** Wraps these subsystems and exposes a simple interface.

**TypeScript Example:**

```typescript
// Subsystem classes
class CPU {
  freeze(): void {
    console.log('CPU freezing...');
  }
  jump(position: number): void {
    console.log(`CPU jumping to ${position}`);
  }
  execute(): void {
    console.log('CPU executing...');
  }
}

class Memory {
  load(position: number, data: string): void {
    console.log(`Memory loading data at ${position}: ${data}`);
  }
}

class HardDrive {
  read(lba: number, size: number): string {
    return `Data from sector ${lba} (size: ${size})`;
  }
}

// Facade class
class ComputerFacade {
  private cpu = new CPU();
  private memory = new Memory();
  private hardDrive = new HardDrive();

  start(): void {
    console.log('ComputerFacade: Starting computer...');
    this.cpu.freeze();
    const bootData = this.hardDrive.read(0, 1024);
    this.memory.load(0, bootData);
    this.cpu.jump(0);
    this.cpu.execute();
  }
}

// Client code
const computer = new ComputerFacade();
computer.start();
```

**Pros & Cons:**

- **Pros:**
  - Simplifies client usage of complex subsystems.
  - Reduces coupling between clients and the internal workings of subsystems.
- **Cons:**
  - May become overly complex if it takes on too many responsibilities.
  - Can obscure the underlying system, making debugging harder.

**Mnemonic / Memory Aid:**  
_"Facade is like a hotel concierge—offering you a simple interface to manage a complex set of services. When you need to simplify interaction with a subsystem, think Facade."_

---

### 6. Flyweight

**Intent & Problem Solved:**  
Minimizes memory usage by sharing as much data as possible with similar objects.

- **Common Use Cases:**
  - Rendering a large number of similar objects (e.g., characters in a document, trees in a forest).
  - Optimizing memory usage when many objects share the same data.

**Basic Structure:**

- **Flyweight Interface:** Declares methods that operate on both intrinsic (shared) and extrinsic (context-specific) states.
- **Concrete Flyweight:** Implements the interface and stores intrinsic state.
- **Flyweight Factory:** Manages and shares flyweight objects.

**TypeScript Example:**

```typescript
// Flyweight interface
interface TreeType {
  draw(x: number, y: number): void;
}

// Concrete Flyweight
class ConcreteTreeType implements TreeType {
  constructor(
    private name: string,
    private color: string,
    private texture: string
  ) {}

  draw(x: number, y: number): void {
    console.log(
      `Drawing a ${this.name} tree at (${x}, ${y}) with color ${this.color} and texture ${this.texture}`
    );
  }
}

// Flyweight Factory
class TreeFactory {
  private treeTypes: { [key: string]: TreeType } = {};

  getTreeType(name: string, color: string, texture: string): TreeType {
    const key = `${name}_${color}_${texture}`;
    if (!this.treeTypes[key]) {
      this.treeTypes[key] = new ConcreteTreeType(name, color, texture);
    }
    return this.treeTypes[key];
  }
}

// Client code
class Tree {
  constructor(public x: number, public y: number, public treeType: TreeType) {}

  draw(): void {
    this.treeType.draw(this.x, this.y);
  }
}

const trees: Tree[] = [];
const treeFactory = new TreeFactory();

// Simulate planting trees
trees.push(new Tree(1, 2, treeFactory.getTreeType('Oak', 'Green', 'Rough')));
trees.push(new Tree(3, 4, treeFactory.getTreeType('Oak', 'Green', 'Rough')));
trees.push(
  new Tree(5, 6, treeFactory.getTreeType('Pine', 'Dark Green', 'Smooth'))
);

trees.forEach((tree) => tree.draw());
```

**Pros & Cons:**

- **Pros:**
  - Dramatically reduces memory usage by sharing common data.
  - Optimizes performance when managing large numbers of similar objects.
- **Cons:**
  - Increases the complexity of the code.
  - Requires careful management of intrinsic versus extrinsic state.

**Mnemonic / Memory Aid:**  
_"Flyweight is as light as a feather—share what’s common to save memory. When many similar objects are needed, think Flyweight."_

---

### 7. Proxy

**Intent & Problem Solved:**  
Provides a surrogate or placeholder for another object to control access, add extra functionality (like lazy loading or logging), or reduce cost.

- **Common Use Cases:**
  - Lazy initialization: delaying the creation of an object until it’s actually needed.
  - Access control: managing access to sensitive or resource-intensive objects.
  - Logging or caching operations.

**Basic Structure:**

- **Subject Interface:** Declares the common interface for both the RealSubject and the Proxy.
- **RealSubject:** The actual object that does the work.
- **Proxy:** Implements the same interface and controls access to the RealSubject.

**TypeScript Example:**

```typescript
// Subject interface
interface Image {
  display(): void;
}

// RealSubject that performs the actual work
class RealImage implements Image {
  constructor(private filename: string) {
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    console.log(`Loading ${this.filename} from disk...`);
  }

  display(): void {
    console.log(`Displaying ${this.filename}`);
  }
}

// Proxy that controls access to the RealImage
class ProxyImage implements Image {
  private realImage: RealImage | null = null;

  constructor(private filename: string) {}

  display(): void {
    if (this.realImage === null) {
      this.realImage = new RealImage(this.filename);
    }
    this.realImage.display();
  }
}

// Client code
const image: Image = new ProxyImage('photo.jpg');
image.display(); // Loads and displays
image.display(); // Only displays, as it’s already loaded
```

**Pros & Cons:**

- **Pros:**
  - Adds a layer of control over object access.
  - Supports lazy initialization and can reduce resource usage.
- **Cons:**
  - Introduces additional levels of indirection.
  - May add complexity if overused.

**Mnemonic / Memory Aid:**  
_"Imagine a doorman controlling entry to a building—the Proxy pattern acts as a gatekeeper, managing access to the real object. When you need controlled access or lazy loading, think Proxy."_

---

## Behavioral Design Patterns

### 1. Chain of Responsibility

**Intent & Problem Solved:**  
Allows a request to be passed along a chain of potential handlers until one of them handles it, decoupling the sender of a request from its receivers.

- **Common Use Cases:** Logging systems, event handling in GUIs, processing requests through a chain (e.g., middleware pipelines).

**Basic Structure:**

- **Handler Interface:** Declares methods for handling requests and setting the next handler.
- **Concrete Handlers:** Implement the handler interface and either process the request or pass it along.

**TypeScript Example:**

```typescript
// Handler Interface
interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: string): string;
}

// Abstract Handler with default behavior for setting next handler
abstract class AbstractHandler implements Handler {
  private nextHandler: Handler | null = null;

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  handle(request: string): string {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    return `No handler processed: ${request}`;
  }
}

// Concrete Handlers
class ConcreteHandlerA extends AbstractHandler {
  handle(request: string): string {
    if (request === 'A') {
      return `Handler A processed: ${request}`;
    }
    return super.handle(request);
  }
}

class ConcreteHandlerB extends AbstractHandler {
  handle(request: string): string {
    if (request === 'B') {
      return `Handler B processed: ${request}`;
    }
    return super.handle(request);
  }
}

// Client code
const handlerA = new ConcreteHandlerA();
const handlerB = new ConcreteHandlerB();

handlerA.setNext(handlerB);

console.log(handlerA.handle('A')); // Processed by Handler A
console.log(handlerA.handle('B')); // Processed by Handler B
console.log(handlerA.handle('C')); // No handler processed
```

**Pros & Cons:**

- **Pros:**
  - Reduces coupling between sender and receivers.
  - Enhances flexibility in assigning responsibilities.
- **Cons:**
  - Uncertainty about which handler will process a request.
  - Can lead to performance issues if the chain is too long.

**Mnemonic / Memory Aid:**  
_"Chain it up! Imagine a relay race where each runner (handler) passes the baton (request) until someone finishes the race."_

---

### 2. Command

**Intent & Problem Solved:**  
Encapsulates a request as an object, allowing parameterization of clients with queues, logs, and support for undoable operations.

- **Common Use Cases:** Implementing transactional behavior (undo/redo), job queues, and remote method invocation.

**Basic Structure:**

- **Command Interface:** Declares an `execute()` method.
- **Concrete Commands:** Bind actions to a receiver.
- **Invoker:** Initiates the command.
- **Receiver:** The object that performs the actual work.

**TypeScript Example:**

```typescript
// Command Interface
interface Command {
  execute(): void;
  undo?(): void; // Optional undo operation
}

// Receiver
class Light {
  on(): void {
    console.log('Light is ON');
  }
  off(): void {
    console.log('Light is OFF');
  }
}

// Concrete Command
class LightOnCommand implements Command {
  constructor(private light: Light) {}
  execute(): void {
    this.light.on();
  }
  undo(): void {
    this.light.off();
  }
}

// Concrete Command
class LightOffCommand implements Command {
  constructor(private light: Light) {}
  execute(): void {
    this.light.off();
  }
  undo(): void {
    this.light.on();
  }
}

// Invoker
class RemoteControl {
  private command: Command | null = null;

  setCommand(command: Command): void {
    this.command = command;
  }

  pressButton(): void {
    if (this.command) {
      this.command.execute();
    }
  }

  pressUndo(): void {
    if (this.command && this.command.undo) {
      this.command.undo();
    }
  }
}

// Client code
const light = new Light();
const lightOn = new LightOnCommand(light);
const lightOff = new LightOffCommand(light);
const remote = new RemoteControl();

remote.setCommand(lightOn);
remote.pressButton(); // Light is ON
remote.pressUndo(); // Light is OFF

remote.setCommand(lightOff);
remote.pressButton(); // Light is OFF
remote.pressUndo(); // Light is ON
```

**Pros & Cons:**

- **Pros:**
  - Decouples the invoker from the receiver.
  - Facilitates operations like undo/redo, queuing, and logging.
- **Cons:**
  - Can lead to a proliferation of command classes.
  - Increased complexity for simple tasks.

**Mnemonic / Memory Aid:**  
_"Command your actions! Think of a remote control button that encapsulates a specific command – when pressed, it always knows what to do."_

---

### 3. Iterator

**Intent & Problem Solved:**  
Provides a way to access elements of an aggregate object sequentially without exposing its underlying representation.

- **Common Use Cases:** Iterating over collections (arrays, lists, trees) in a uniform manner.

**Basic Structure:**

- **Iterator Interface:** Declares methods like `next()`, `hasNext()`, and optionally `current()`.
- **Concrete Iterator:** Implements the iterator for a specific aggregate.
- **Aggregate (Collection):** Provides a method to create an iterator.

**TypeScript Example:**

```typescript
// Iterator Interface
interface Iterator<T> {
  next(): T | null;
  hasNext(): boolean;
}

// Aggregate Interface
interface Aggregate<T> {
  createIterator(): Iterator<T>;
}

// Concrete Aggregate
class NumberCollection implements Aggregate<number> {
  constructor(public items: number[]) {}

  createIterator(): Iterator<number> {
    return new NumberIterator(this.items);
  }
}

// Concrete Iterator
class NumberIterator implements Iterator<number> {
  private index: number = 0;

  constructor(private items: number[]) {}

  next(): number | null {
    if (this.hasNext()) {
      return this.items[this.index++];
    }
    return null;
  }

  hasNext(): boolean {
    return this.index < this.items.length;
  }
}

// Client code
const collection = new NumberCollection([1, 2, 3, 4]);
const iterator = collection.createIterator();

while (iterator.hasNext()) {
  console.log(iterator.next());
}
```

**Pros & Cons:**

- **Pros:**
  - Provides a uniform way to traverse different collections.
  - Encapsulates the iteration logic.
- **Cons:**
  - Can add extra overhead if the aggregate supports simple iteration natively.
  - Complexity increases for custom iterators.

**Mnemonic / Memory Aid:**  
_"Iterate with ease—like flipping through the pages of a book, the Iterator pattern helps you read one element at a time."_

---

### 4. Mediator

**Intent & Problem Solved:**  
Encapsulates how a set of objects interact, promoting loose coupling by preventing objects from referring to each other explicitly.

- **Common Use Cases:** Managing complex communications between multiple objects (e.g., chat rooms, UI dialogs).

**Basic Structure:**

- **Mediator Interface:** Declares methods for communication.
- **Concrete Mediator:** Implements coordination between colleagues.
- **Colleague Classes:** Interact indirectly through the mediator.

**TypeScript Example:**

```typescript
// Mediator Interface
interface Mediator {
  notify(sender: string, event: string): void;
}

// Colleague Base Class
class Colleague {
  constructor(protected mediator: Mediator) {}
}

// Concrete Colleague
class Button extends Colleague {
  click(): void {
    console.log('Button clicked.');
    this.mediator.notify('Button', 'click');
  }
}

class TextBox extends Colleague {
  setText(text: string): void {
    console.log(`TextBox displays: ${text}`);
  }
}

// Concrete Mediator
class DialogMediator implements Mediator {
  private button!: Button;
  private textBox!: TextBox;

  setComponents(button: Button, textBox: TextBox): void {
    this.button = button;
    this.textBox = textBox;
  }

  notify(sender: string, event: string): void {
    if (sender === 'Button' && event === 'click') {
      this.textBox.setText('Button was clicked!');
    }
  }
}

// Client code
const mediator = new DialogMediator();
const button = new Button(mediator);
const textBox = new TextBox(mediator);
mediator.setComponents(button, textBox);

button.click(); // TextBox displays: Button was clicked!
```

**Pros & Cons:**

- **Pros:**
  - Reduces direct dependencies between colleagues.
  - Simplifies communication and control over interactions.
- **Cons:**
  - The mediator can become complex and take on too many responsibilities.
  - May lead to a central point of failure.

**Mnemonic / Memory Aid:**  
_"Think of a mediator as the ultimate party host—coordinating conversations between guests (objects) so everyone gets along without direct conflicts."_

---

### 5. Memento

**Intent & Problem Solved:**  
Captures and externalizes an object's internal state without violating encapsulation, so that the object can be restored later.

- **Common Use Cases:** Implementing undo/redo operations, snapshots in editors, state rollback.

**Basic Structure:**

- **Memento:** Stores the internal state of an object.
- **Originator:** Creates and restores the memento.
- **Caretaker:** Manages the mementos without examining their content.

**TypeScript Example:**

```typescript
// Memento
class Memento {
  constructor(private state: string) {}

  getState(): string {
    return this.state;
  }
}

// Originator
class Editor {
  private content: string = '';

  setContent(content: string): void {
    this.content = content;
    console.log(`Editor content set to: ${this.content}`);
  }

  createMemento(): Memento {
    return new Memento(this.content);
  }

  restore(memento: Memento): void {
    this.content = memento.getState();
    console.log(`Editor content restored to: ${this.content}`);
  }
}

// Caretaker
class History {
  private mementos: Memento[] = [];

  push(memento: Memento): void {
    this.mementos.push(memento);
  }

  pop(): Memento | undefined {
    return this.mementos.pop();
  }
}

// Client code
const editor = new Editor();
const history = new History();

editor.setContent('Version 1');
history.push(editor.createMemento());

editor.setContent('Version 2');
history.push(editor.createMemento());

editor.setContent('Version 3');

// Undo last change
const memento = history.pop();
if (memento) {
  editor.restore(memento);
}
```

**Pros & Cons:**

- **Pros:**
  - Preserves encapsulation while saving state.
  - Simplifies implementing undo/redo mechanisms.
- **Cons:**
  - Can consume significant memory if many states are saved.
  - Might violate encapsulation if not designed carefully.

**Mnemonic / Memory Aid:**  
_"Keep a memento—just like a keepsake that reminds you of the past, this pattern stores an object's state for a trip down memory lane (or an undo operation)."_

---

### 6. Observer

**Intent & Problem Solved:**  
Defines a one-to-many dependency so that when one object changes state, all its dependents are notified and updated automatically.

- **Common Use Cases:** Event handling systems, data binding in UI frameworks, real-time notifications.

**Basic Structure:**

- **Subject:** Maintains a list of observers and notifies them of state changes.
- **Observer:** Defines an updating interface for objects that should be notified.
- **Concrete Subject and Observers:** Implement the required behavior.

**TypeScript Example:**

```typescript
// Observer interface
interface Observer {
  update(message: string): void;
}

// Subject interface
interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(): void;
}

// Concrete Subject
class NewsAgency implements Subject {
  private observers: Observer[] = [];
  private news: string = '';

  attach(observer: Observer): void {
    this.observers.push(observer);
  }

  detach(observer: Observer): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  setNews(news: string): void {
    this.news = news;
    this.notify();
  }

  notify(): void {
    for (const observer of this.observers) {
      observer.update(this.news);
    }
  }
}

// Concrete Observer
class NewsChannel implements Observer {
  update(message: string): void {
    console.log(`NewsChannel received update: ${message}`);
  }
}

// Client code
const agency = new NewsAgency();
const channel1 = new NewsChannel();
const channel2 = new NewsChannel();

agency.attach(channel1);
agency.attach(channel2);

agency.setNews('Breaking News: TypeScript Rocks!');
```

**Pros & Cons:**

- **Pros:**
  - Promotes loose coupling between subjects and observers.
  - Supports dynamic addition and removal of observers.
- **Cons:**
  - Can lead to unexpected updates if not managed properly.
  - May create performance overhead with a large number of observers.

**Mnemonic / Memory Aid:**  
_"Be an observer—just like a subscriber to your favorite channel. When the news (state) updates, all your subscribers (observers) get notified automatically."_

---

### 7. State

**Intent & Problem Solved:**  
Allows an object to alter its behavior when its internal state changes, making it appear as if the object changed its class.

- **Common Use Cases:** Managing stateful behavior in objects such as UI components, workflow engines, and protocol implementations.

**Basic Structure:**

- **State Interface:** Declares methods for state-specific behavior.
- **Concrete States:** Implement state-specific behavior.
- **Context:** Maintains an instance of a ConcreteState and delegates state-specific requests.

**TypeScript Example:**

```typescript
// State interface
interface State {
  handle(context: Context): void;
}

// Concrete States
class ConcreteStateA implements State {
  handle(context: Context): void {
    console.log('State A handling request and switching to State B');
    context.setState(new ConcreteStateB());
  }
}

class ConcreteStateB implements State {
  handle(context: Context): void {
    console.log('State B handling request and switching to State A');
    context.setState(new ConcreteStateA());
  }
}

// Context
class Context {
  private state: State;

  constructor(initialState: State) {
    this.state = initialState;
  }

  setState(state: State): void {
    this.state = state;
  }

  request(): void {
    this.state.handle(this);
  }
}

// Client code
const context = new Context(new ConcreteStateA());
context.request(); // Switches to State B
context.request(); // Switches back to State A
```

**Pros & Cons:**

- **Pros:**
  - Localizes state-specific behavior.
  - Makes state transitions explicit.
- **Cons:**
  - Can lead to an increase in the number of classes.
  - May complicate the design if there are too many states.

**Mnemonic / Memory Aid:**  
_"State of mind—just like moods change how you react, the State pattern lets an object change its behavior when its state changes."_

---

### 8. Strategy

**Intent & Problem Solved:**  
Defines a family of algorithms, encapsulates each one, and makes them interchangeable so that the algorithm can vary independently from clients that use it.

- **Common Use Cases:** Sorting algorithms, compression techniques, and any scenario where you might want to switch algorithms at runtime.

**Basic Structure:**

- **Strategy Interface:** Declares a method common to all supported algorithms.
- **Concrete Strategies:** Implement the algorithm.
- **Context:** Uses a Strategy instance to execute the algorithm.

**TypeScript Example:**

```typescript
// Strategy Interface
interface Strategy {
  execute(data: number[]): number[];
}

// Concrete Strategies
class BubbleSortStrategy implements Strategy {
  execute(data: number[]): number[] {
    console.log('Sorting using Bubble Sort');
    return data.sort((a, b) => a - b);
  }
}

class QuickSortStrategy implements Strategy {
  execute(data: number[]): number[] {
    console.log('Sorting using Quick Sort');
    // For brevity, using native sort to simulate quick sort.
    return data.sort((a, b) => a - b);
  }
}

// Context
class Sorter {
  constructor(private strategy: Strategy) {}

  setStrategy(strategy: Strategy): void {
    this.strategy = strategy;
  }

  sort(data: number[]): number[] {
    return this.strategy.execute(data);
  }
}

// Client code
const data = [5, 2, 9, 1, 5, 6];
const sorter = new Sorter(new BubbleSortStrategy());
console.log(sorter.sort(data));

sorter.setStrategy(new QuickSortStrategy());
console.log(sorter.sort(data));
```

**Pros & Cons:**

- **Pros:**
  - Promotes flexibility by enabling algorithm interchangeability.
  - Encourages clean separation of concerns.
- **Cons:**
  - Increases the number of classes.
  - Clients must be aware of different strategies and choose appropriately.

**Mnemonic / Memory Aid:**  
_"Pick your strategy—like choosing a game plan, the Strategy pattern lets you swap out algorithms on the fly to best fit your problem."_

---

### 9. Template Method

**Intent & Problem Solved:**  
Defines the skeleton of an algorithm in an operation, deferring some steps to subclasses so that they can redefine certain steps without changing the algorithm's structure.

- **Common Use Cases:** Frameworks where the overall process is fixed but some steps can be customized (e.g., data processing pipelines, game engines).

**Basic Structure:**

- **Abstract Class:** Implements the template method outlining the algorithm steps.
- **Concrete Classes:** Override specific steps without altering the overall algorithm.

**TypeScript Example:**

```typescript
// Abstract class with template method
abstract class DataProcessor {
  // Template method
  process(): void {
    this.readData();
    this.transformData();
    this.saveData();
  }

  protected abstract readData(): void;
  protected abstract transformData(): void;

  protected saveData(): void {
    console.log('Saving data to database');
  }
}

// Concrete implementation
class CSVDataProcessor extends DataProcessor {
  protected readData(): void {
    console.log('Reading data from CSV file');
  }

  protected transformData(): void {
    console.log('Transforming CSV data');
  }
}

// Client code
const csvProcessor = new CSVDataProcessor();
csvProcessor.process();
```

**Pros & Cons:**

- **Pros:**
  - Provides a clear outline of an algorithm.
  - Promotes code reuse by letting subclasses share the common structure.
- **Cons:**
  - Inflexible in changing the algorithm’s structure.
  - Subclasses may override methods in unintended ways.

**Mnemonic / Memory Aid:**  
_"Follow the template—just as a recipe guides you through cooking, the Template Method provides a step-by-step guide that you can customize along the way."_

---

### 10. Visitor

**Intent & Problem Solved:**  
Allows you to define a new operation without changing the classes of the elements on which it operates, effectively separating an algorithm from the object structure.

- **Common Use Cases:** Performing operations on complex object structures, such as abstract syntax trees, file systems, or composite structures, without modifying the element classes.

**Basic Structure:**

- **Visitor Interface:** Declares visit methods for each concrete element type.
- **Concrete Visitors:** Implement the operations.
- **Element Interface:** Declares an `accept()` method.
- **Concrete Elements:** Implement the `accept()` method to call back the visitor.

**TypeScript Example:**

```typescript
// Visitor interface
interface Visitor {
  visitFile(file: FileElement): void;
  visitDirectory(directory: DirectoryElement): void;
}

// Element interface
interface Element {
  accept(visitor: Visitor): void;
}

// Concrete Elements
class FileElement implements Element {
  constructor(public name: string) {}

  accept(visitor: Visitor): void {
    visitor.visitFile(this);
  }
}

class DirectoryElement implements Element {
  public children: Element[] = [];
  constructor(public name: string) {}

  add(element: Element): void {
    this.children.push(element);
  }

  accept(visitor: Visitor): void {
    visitor.visitDirectory(this);
    for (const child of this.children) {
      child.accept(visitor);
    }
  }
}

// Concrete Visitor
class SizeVisitor implements Visitor {
  private totalSize: number = 0;

  visitFile(file: FileElement): void {
    // Let's assume each file adds a fixed size.
    this.totalSize += 1;
  }

  visitDirectory(directory: DirectoryElement): void {
    // Directories themselves add negligible size.
  }

  getTotalSize(): number {
    return this.totalSize;
  }
}

// Client code
const root = new DirectoryElement('root');
const file1 = new FileElement('file1.txt');
const file2 = new FileElement('file2.txt');
const subDir = new DirectoryElement('subdir');
subDir.add(new FileElement('file3.txt'));
root.add(file1);
root.add(file2);
root.add(subDir);

const visitor = new SizeVisitor();
root.accept(visitor);
console.log('Total size (number of files):', visitor.getTotalSize());
```

**Pros & Cons:**

- **Pros:**
  - Adds new operations without modifying existing element classes.
  - Can gather related operations into a single class.
- **Cons:**
  - Can break encapsulation by exposing internal details.
  - Adding new element classes requires updating all visitors.

**Mnemonic / Memory Aid:**  
_"Visit and explore—like a tourist exploring different landmarks, the Visitor pattern goes through each element and performs operations without changing the scenery."_

---

# End of Document

This file covers the three groups of design patterns along with all the detailed explanations, code samples, pros and cons, and creative mnemonics to help you quickly recall when and why to use each pattern.

_Feel free to modify or extend the document as needed for your projects or learning material._
