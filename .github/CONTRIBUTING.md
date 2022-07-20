## Git workflow

This project makes use of the [Gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) workflow.

### Branch naming conventions

- `main` - The main branch is for code ready to be released to the production environment.
- `{feat|fix|docs}/{issue-number}--{short-description}` - Work branches for issue specific work. Bug fixes and minor new features branch off `main` and PR's merge back into `main`.

### Pull requests

Pull requests should be named with the GitHub Issue Number (if applicable) plus a brief description. Example:

> {ticket-number}: {short description}

The description should start with [closing keyword and issue id](https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword) to link PR to the issues being addressed.

> Closes #1234

Also include a brief description of what the pull request is doing if it is more involved than what can be adequately communicated in the title.

Lastly, include complete steps to functionally test the pull request.

You will be presented with a template containing these main components when you create a new PR. Some default initialization steps will be included. Append your review steps to those.

If the PR is for work still in progress, save it as a [Draft Pull Request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests#draft-pull-requests).

### Assignment and acceptance

All pull requests need to go through a review process. When your pull request is ready to be reviewed:

- Select at least one _Reviewer_.
- Set your self as the _Assignee_.
- For Draft PR, Click _Ready for review_.

Reviewer will then review PR and provide feedback. Address any feedback as it comes in, discussing the issues in the comments of the PR. Once the reviewer approves changes, make sure all checks are green, then merge the PR. If the PR can not be merged to `main`, use GitHub to merge `main` into the work branch and resolve conflicts.

### Additional pull request best practices

- Generally, pull requests should resolve a single GitHub issue. Try to avoid combining multiple issues into a single pull request. There may be instances where it makes sense to do otherwise but please use discretion.
- Try to keep pull requests reasonably small and discrete. Following the one pull request per issue paradigm should accomplish this by default. However, if you are beginning to work on an issue and it feels like it will result in a giant pull request with lots of custom code, changes across many features, and lots of testing scenarios, think about how you might break down the issue into smaller subtasks that could be incrementally developed and tested. Convert the issue into an epic, then create new issues for the subtasks, assigning the issue to that epic.

## Coding standards

Coding standards will be rigorously enforced on this project. Please save everybody time by checking for common syntax errors in your custom code and fixing them before you send your pull request into review. This project has few yarn scripts that, when run, will analyze the codebase and produce a report of all coding standards violations that should be corrected. These scripts will be executed prior to a commit being formed to ensure code committed to the project is correctly formed.

There are scripts included in this project to help check your custom code for common errors. From within the project you can run:

- `yarn lint` to lint all of your custom code.
- `yarn format:check` to automatically format your code.

### VSCode Extensions

Install these extensions to help with formatting and code hinting as you work and save files:

- EditorConfig
- ESLint
- Prettier - Code formatter
- Code Spell Checker

## Commit message standards

This project makes use of the Commitizen commit convention, which is documented explicitly in [Angular's contribution docs](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit).
