---
layout: default
title: Contributing
nav_order: 998
parent: LiveMap Interface
---

# Contributing to LiveMap Interface <!-- omit in toc --> 

First off, thanks for taking the time to contribute! ❤️ 

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions. 🎉 

> And if you like the project, but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which we would also be very happy about: 
> - Star the project 
> - Tweet about it 

## Table of Contents <!-- omit in toc -->

- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
- [Commit Messages](#commit-messages)
  - [Commit Message Header](#commit-message-header)
    - [Type](#type)
    - [Scope](#scope)
    - [Summary](#summary)
  - [Commit Message Body](#commit-message-body)
  - [Commit Message Footer](#commit-message-footer)
  - [Revert commits](#revert-commits)


## I Have a Question 

> If you want to ask a question, we assume that you have read the available [Documentation](https://docs.tgrhavoc.co.uk/livemap-interface/). 

Before you ask a question, it is best to search for existing [Issues](https://github.com/TGRHavoc/live_map-interface/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first. 

If you then still feel the need to ask a question and need clarification, we recommend the following: 

- Start a [Issue](https://github.com/TGRHavoc/live_map-interface/issues/new?labels=question). 
- Provide as much context as you can about what you're running into. 
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant. 

We will then take care of the issue as soon as possible. 

## I Want To Contribute 

> ### Legal Notice <!-- omit in toc --> 
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project license. 

### Reporting Bugs 

#### Before Submitting a Bug Report <!-- omit in toc --> 

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible. 

- Make sure that you are using the latest version. 
- Determine if your bug is really a bug and not an error on your side e.g. incorrectly configured (Make sure that you have read the [documentation](https://docs.tgrhavoc.co.uk/livemap-interface/). If you are looking for support, you might want to check [this section](#i-have-a-question)). 
- To see if other users have experienced (and potentially already solved) the same issue you are having, check if there is not already a bug report existing for your bug or error in the [bug tracker](https://github.com/TGRHavoc/live_map-interface/issues?q=label%3Abug). 
- Also make sure to search the internet (including Stack Overflow) to see if users outside of the GitHub community have discussed the issue. 
- Collect information about the bug: 
- Console Errors (Shift + CTRL + J)
- Browser (including version) and OS (Windows, Linux, macOS, x86, ARM) 
- Possibly your input and the output or what you did to get the issue
- Can you reliably reproduce the issue? And can you also reproduce it with older versions? 

#### How Do I Submit a Good Bug Report? <!-- omit in toc --> 

> You must never report security related issues, vulnerabilities or bugs to the issue tracker, or elsewhere in public. Instead please use the [Security Advisories](https://github.com/TGRHavoc/live_map-interface/security/advisories) feature of Github.

<!-- TODO: Maybe add email and PGP key to allow the messages to be sent encrypted to email as well. --> 

We use GitHub issues to track bugs and errors. If you run into an issue with the project: 

- Open an [Issue](https://github.com/TGRHavoc/live_map-interface/issues/new). (Since we can't be sure at this point whether it is a bug or not, we ask you not to talk about a bug yet and not to label the issue.) 
- Explain the behavior you would expect and the actual behavior. 
- Please provide as much context as possible and describe the *reproduction steps* that someone else can follow to recreate the issue on their own. This usually includes your code. For good bug reports you should isolate the problem and create a reduced test case. 
- Provide the information you collected in the previous section. 

Once it's filed: 

- The project team will label the issue accordingly. 
- A team member will try to reproduce the issue with your provided steps. If there are no reproduction steps or no obvious way to reproduce the issue, the team will ask you for those steps and mark the issue as `needs-repro`. Bugs with the `needs-repro` tag will not be addressed until they are reproduced. 
- If the team is able to reproduce the issue, it will be marked `needs-fix`, as well as possibly other tags (such as `critical`), and the issue will be left to be [implemented by someone](#your-first-code-contribution). 

There will be templates you can follow whilst filling out issues.
Please fill these out to the best of your ability when submitting an issue as it will allow the issue to be dealt with smoother and quicker than without.

### Suggesting Enhancements 

This section guides you through submitting an enhancement suggestion for LiveMap Interface, **including completely new features and minor improvements to existing functionality**. Following these guidelines will help maintainers and the community to understand your suggestion and find related suggestions. 

#### Before Submitting an Enhancement <!-- omit in toc --> 

- Make sure that you are using the latest version. 
- Read the [documentation](https://docs.tgrhavoc.co.uk/livemap-interface/) carefully and find out if the functionality is already covered, maybe by an individual configuration. 
- Perform a [search](https://github.com/TGRHavoc/live_map-interface/issues) to see if the [enhancement](https://github.com/TGRHavoc/live_map-interface/labels/enhancement) or [feature request](https://github.com/TGRHavoc/live_map-interface/labels/feature-request) has already been suggested. If it has, add a comment to the existing issue instead of opening a new one. 
- Find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince the project's developers of the merits of this feature. Keep in mind that we want features that will be useful to the majority of our users and not just a small subset. If you're just targeting a minority of users, consider writing an add-on/plugin library. 

#### How Do I Submit a Good Enhancement Suggestion? <!-- omit in toc --> 

Enhancement suggestions are tracked as [GitHub issues](https://github.com/TGRHavoc/live_map-interface/labels/enhancement). 

- Use a **clear and descriptive title** for the issue to identify the suggestion. 
- Provide a **step-by-step description of the suggested enhancement** in as much detail as possible. 
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why. At this point you can also tell which alternatives do not work for you. 
- You may want to **include screenshots and animated GIFs** which help you demonstrate the steps or point out the part which the suggestion is related to. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux. 
- **Explain why this enhancement would be useful** to most LiveMap Interface users. You may also want to point out the other projects that solved it better and which could serve as inspiration. 

### Your First Code Contribution 
In order to get started with contributing code to LiveMap Interface, you will need to have a text editor or an Integrated Development Environment (IDE). 
The most popular text editors that you might want to use include (but is not limited to) [VisualStudio Code](https://code.visualstudio.com/), [Atom](https://atom.io/), [Sublime Text](https://www.sublimetext.com/) or [Notepad++](https://notepad-plus-plus.org/downloads/).

After you have your editor/IDE set up to your liking and you're ready to get coding, head over to the [developers](developers.md) file for more information. 

## Commit Messages 

This project utilises the [Conventional Commits Guidelines](https://www.conventionalcommits.org/en/v1.0.0/).
All commits should follow this convention as it leads to **more readable messages** that are easy to follow when looking through the **project history**.

Each commit message consists of a **header**, a **body**, and a **footer**.

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The `header` is mandatory and must conform to the [Commit Message Header](#commit-message-header) format.

The `body` is mandatory for all commits except for those of type "docs".
When the body is present it must be at least 20 characters long and must conform to the [Commit Message Body](#commit-message-body) format.

The `footer` is optional. The [Commit Message Footer](#commit-message-footer) format describes what the footer is used for and the structure it must have.

Any line of the commit message cannot be longer than 100 characters.


### Commit Message Header

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test
```

The `<type>` and `<summary>` fields are mandatory, the `(<scope>)` field is optional.


#### Type

Must be one of the following:

* **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
* **ci**: Changes to our CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs)
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **test**: Adding missing tests or correcting existing tests
* **translation**: Adding or updating translations


#### Scope
The scope should be the name of the file being modified.
If creating a new file or general changes in a directory then, the directory name (or one of the parents if more descriptive) will suffice.

If you're unsure of the scope then, just leave it blank.

#### Summary

Use the summary field to provide a succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize the first letter
* no dot (.) at the end


### Commit Message Body

Just as in the summary, use the imperative, present tense: "fix" not "fixed" nor "fixes".

Explain the motivation for the change in the commit message body. This commit message should explain _why_ you are making the change.
You can include a comparison of the previous behavior with the new behavior in order to illustrate the impact of the change.


### Commit Message Footer

The footer can contain information about breaking changes and is also the place to reference GitHub issues, Jira tickets, and other PRs that this commit closes or is related to.

```
BREAKING CHANGE: <breaking change summary>
<BLANK LINE>
<breaking change description + migration instructions>
<BLANK LINE>
<BLANK LINE>
Fixes #<issue number>
```

Breaking Change section should start with the phrase "BREAKING CHANGE: " followed by a summary of the breaking change, a blank line, and a detailed description of the breaking change that also includes migration instructions if required.


### Revert commits

If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit.

The content of the commit message body should contain:

- information about the SHA of the commit being reverted in the following format: `This reverts commit <SHA>`,
- a clear description of the reason for reverting the commit message.
