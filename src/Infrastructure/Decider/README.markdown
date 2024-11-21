# Decider

In order to model using events and commands as a primary building block we want to use something that puts these
elements at the center of our domain model.
One of the ways to do this is using a `Decider` pattern.
A `Decider` is a simple stateless function that accepts `commands` and the `currentState` and produces `events`.
These events can be used to reduce the `currentState` to the `newState` using an `evolve` function.
By following this pattern we are able to describe our tests using the components of our event storming
artifact (events/commands) which allows anyone with understanding of the model to contribute solutions.

![Decider pattern visual](./Decider.jpg)

## StateLoader

There are two different ways to make a `Decider` persistent. One of these ways is by storing the `newState` every time
we are done processing a command. An implementation of `StateLoader` is sufficient to make this work. 
