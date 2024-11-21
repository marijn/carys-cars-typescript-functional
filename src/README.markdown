# Layered Architecture

In order to isolate the domain model from the rest, the layout of this app is according to the layered architecture.
Elements of the design in the higher layers is allowed to couple to the elements of the design in the lower layers,
but elements in the lower layers of the design are NOT allowed to couple to elements of the design in the higher layers.

## Layers

- 4. [user interface](./UserInterface)
- 3. [application](./Application)
- 2. [domain](./Domain)
- 1. [infrastructure](./Infrastructure)
