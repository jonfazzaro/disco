## Disco 
- To run the specs: `npm run spec -- --run`
- To run the app: `npm run dev`

## React
- Components should contain minimal imperative/logic code (usually the code above the statement that returns JSX). Instead, this logic should be factored out to a custom hook named the same as the component, but with the `use` prefix. For example, the presentation logic for the `ProductList` component can be found in the `useProductList` hook.
- Components themselves do not require specs or unit tests, but their custom hooks should be governed by executable specifications per the same standards listed above.

## Design & Structure
- Place code that changes together in the same module/class.
- Separate code that changes for different reasons.
- Use dependency injection for testability and loose coupling.
- Keep methods to about 5 lines of code; if longer, extract new methods.
- Favor composition over inheritance to promote flexibility.
- Create immutable values and objects when possible to reduce side effects.
- Extract complex conditional logic into well-named methods or strategy objects.
- Implement domain objects that express the ubiquitous language of the business.
- Replace "primitive obsession" with value objects that encapsulate behavior.
- Factor out duplicated code when there are at least three repetitions of the same code or pattern.
- Apply Tell-Don't-Ask principle to encapsulate behavior with data.

### Architecture
- Organize code files and directories first by domain concepts, not technical layers ("Products" and "Orders", not "UI" and "Services").
- Place all related code (UI, services, repositories) for a domain concept in the same module.
- Create clear boundaries between bounded contexts in the domain.
- Apply hexagonal/ports and adapters architecture to isolate core domain from infrastructure.
- Design the core domain without dependencies on external frameworks or systems.
- Use shared kernel patterns for concepts that span multiple bounded contexts.
- Express the ubiquitous language of the domain in module and package names.
- Maintain layering within domain modules, not across the entire application.
- Separate stable business rules from volatile UI and infrastructure concerns.
- Ensure domain logic has no outward dependencies on infrastructure or UI code.
- Apply Clean Architecture principles with dependencies pointing inward.
- Create anti-corruption layers between legacy systems and new domain models.
- Design bounded contexts to be deployable as independent services when appropriate.
- Make system boundaries explicit through well-defined interfaces.

### Naming
- Name variables, methods, and classes after their intent, not implementation.
- Avoid unnecessary encodings of datatypes along with the variable name.
- Ensure that names are pronounceable; avoid tongue twisters.
- Use nouns or noun phrases for variables to convey purpose and content.
- Structure boolean variable names as predicates (is..., has..., can..., should...).
- Name boolean-returning functions as predicates for natural use in conditionals.
- Use adjectives for enum values to represent their characteristics.
- Make function and method names action-oriented with verbs describing what they do.
- Avoid excessive acronyms and abbreviations that sacrifice clarity.
- Use shorter names for variables with shorter scopes; longer, more descriptive names for wider scopes.
- Give modules/classes/functions with longer scopes shorter names; those with shorter scopes longer, more specific names.
- Use domain terminology consistently in naming to reinforce the ubiquitous language.
- Include units in variable names when they represent physical quantities.
- Avoid generic names like "data", "info", or "value" without specific context.

### Code Quality
- Replace comments with better method and variable names.
- Extract complex expressions into well-named methods.
- Keep indentation levels to a minimum (1-2 ideally).
- Eliminate duplicate code ruthlessly, even if only a few lines.
- Transform procedural code to functional with map/filter/reduce.
- Replace conditionals with polymorphism when checking type or state.
- Apply command-query separation: methods either do something or answer something.
- Keep all entities (classes, methods, etc.) at a consistent level of abstraction.
- Fail fast: identify invalid inputs or states early.
- Use intention-revealing method names that form a domain-specific language.
- Avoid abbreviations unless universally understood in the domain.
- Isolate code that interacts with external systems (database, API, etc.).
- Express concepts once and only once in the codebase.
- Prefer pure functions that don't rely on or modify external state.
- Apply law of Demeter: only talk to immediate friends.

### Functional Programming Techniques
- Prefer pure functions that depend only on their inputs.
- Use map/filter/reduce over imperative loops.
- Avoid mutating state; return new state instead.
- Employ function composition to build complex operations from simple ones.
- Utilize higher-order functions to abstract common patterns.
- Implement lazy evaluation when processing large collections.
- Apply partial application to create specialized functions.
- Use the pipeline pattern (method chaining) for data transformations.
- Separate data from behavior when applicable.
- Apply functional composition instead of inheritance hierarchies.
- Capture side effects at the boundaries of your system.
- Prefer immutable collections over mutable ones.
- Use option/maybe types over null references.
- Favor declarative over imperative code styles.
- Define small, composable functions that do one thing well.

## Refactoring
- Extract method when code explains "how" instead of "what".
- Replace temporary variables with query methods.
- Extract class when a class has multiple responsibilities.
- Replace conditionals with polymorphism for type or state checks.
- Introduce parameter object when methods have too many parameters.
- Replace error codes with exceptions for exceptional conditions.
- Lift conditional boundaries to better isolate decision points.
- Apply strategy pattern to encapsulate varying algorithms.
- Use factory methods to clarify object creation intent.
- Refactor to the Open-Closed Principle before adding features.
- Introduce null objects instead of null checks throughout code.
- Replace nested conditionals with guard clauses.
- Use decorator pattern to add behavior without inheritance.
- Apply Sprout Method/Sprout Class when changing difficult legacy code.
- Use seams to isolate hard-to-specify code during refactoring.

## Executable Specifications
- Create specifications BEFORE implementing any new feature or modification.
    - You may also know this approach as Test-Driven Development, or TDD.
    - I don't want the resulting code to use the terminology of testing, though--this is specification, conceptually.
- Create a failing specification before implementing functionality.
- Pass the specification with the simplest possible implementation.
- Design the code that passed after the specification passes.
- The work isn't done if the specs aren't passing.
- The work isn't done if the specs don't fully describe the behavior required.
- Focus on specifying behavior, not implementation details.
- Use descriptive specification names that document the expected behavior.
- Create focused specifications with a single logical expectation.
- Never use mocking frameworks; create Control objects instead.
- Implement Control versions of dependencies (e.g., `ControlledRecipeRepository` implementing `RecipeRepository`).
- Design Control objects to have predefined inputs/outputs configurable by specifications.
- Expose side effects in Control objects as inspectable properties (e.g., `loggedOutput`).
- Define Control implementations alongside production code to enable runtime substitution.
- Establish, Execute, Expect instead of Arrange, Act, Assert.
- Structure specifications in a Given-When-Then format.
- Specify behavior at boundaries and edge cases explicitly.
- Write the specification first to guide implementation.
- Separate User Specifications (whole system) from Code Specifications (isolated components).
- Use multiple specifications to triangulate complex behaviors.

### Specification Design
- Name specifications as executable documentation: "should_perform_action_when_condition".
- Specify behavior rather than implementation details.
- Use Control objects to isolate dependencies rather than test doubles.
- Create builders for complex object establishment in specifications.
- Write failing specifications before fixing bugs to prevent regression.
- Apply Given-When-Then structure to all specifications.
- Keep specification setup code DRY but explicit.
- Create separate specification classes for separate concerns.
- There should only be one execution (act) per specification.
- Focus on public interfaces rather than implementation details.
- Specify unhappy paths and edge cases, not just the happy path.
- Maintain one logical expectation per specification to clarify failures.
- Use specification-specific equality methods rather than object identity.
- Write User Specifications for critical paths across the whole system.
- Apply the FIRST principles to specifications: Fast, Isolated, Repeatable, Self-verifying, Timely.
- Structure User Specifications to validate the entire system behavior.
- Use Code Specifications for isolated components and units.

### Specification Structure and Naming
- Use a describe/it nested structure to make complex combinations of conditions simpler to navigate.
- Express each "Given" (precondition or data state) as a separate describe block or nested class.
- Express each "When" (event or user action) as a separate describe block or nested class.
- Nest "Given" blocks inside "When" blocks to express the same action under different conditions.
- Name "When" blocks to describe the event or action being taken (e.g., "When_user_submits_form").
- Name "Given" blocks to describe the precondition or state (e.g., "Given_valid_input_data").
- Use "should" or "it should" to start specification method names (e.g., "should_return_success_status").
- Ensure specification names read as complete sentences when combined with their describe blocks.
- Create a distinct specification for each expected outcome, not each execution path.
- Group related specifications in the same file or class to improve discoverability.
- Match specification structure to the domain concept hierarchy when appropriate.
- Prefer more describe nesting over longer individual specification names.
- Place common setup in the outermost applicable describe block.
- Use specification names as living documentation of system behavior.
- Ensure specification failure messages clearly indicate what was expected vs. what occurred.# Tactical Programming Guidelines for AI Assistants

## Practical Application
- Start each feature with a failing User Specification.
- Develop inside-out: build core domain objects before infrastructure.
- Use hexagonal architecture to separate domain from infrastructure.
- Establish clear boundaries between application layers.
- Ensure each class has a single level of abstraction internally.
- Employ continuous refactoring after specifications pass, not as a separate phase.
- Apply the Boy Scout Rule: leave code cleaner than you found it.
- Make each commit a logical, working increment that passes specifications.
- Prioritize readability over cleverness.
- Design for specifiability from the start.
- Refactor before adding new features to the same area.
- Create a ubiquitous language shared by code and domain experts.
- Treat warnings as errors to maintain code quality.
- Use static analysis tools to enforce agreed coding standards.
- Pair program on complex features or critical refactorings.

## When in Doubt

+ Start simple. Add layers and patterns only when the need arises.
+ Favor clear, self-contained modules.
+ Ask: "Would another developer—or a future me—understand what this code is doing without reading the full call stack?"