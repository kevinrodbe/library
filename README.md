# Code School Content Library

This repository is for long-term storage of any content repositories
created for courses.

Unlike prior attempts, everything is stored in the master branch for
clarity. We use git subtree merging to avoid losing git history from
the original content repositories.

## Naming conventions
Please please be consistent with the following naming conventions:

Regardless of what the repo name on GitHub, this is how you should name
the directory once added to this one:

- original repo: `TryGitCourseContent`
- merged repo: `try_git`

- original repo: `AdvancedGitCourseContent`
- merged_repo: `git_real_1`

Why? Because `AdvancedGitCourse` was a codename before we had a proper
title for the course, and it's far easier to identify content with the
course's proper name.

But you don't like underscores?

![boo hoo](http://img4.wikia.nocookie.net/__cb20140910042820/glee/images/2/2e/Boo-hoo.gif)

## How to merge an existing content repository into the Library
Based on [this blog post](http://jasonkarns.com/blog/merge-two-git-repositories-into-one/).

1. Clone this repository
2. `cd library/`
3. `git remote add -f repo_to_merge https://github.com/codeschool/repo_to_merge.git`
4. `git merge -s ours --no-commit repo_to_merge/master`
5. `git read-tree --prefix=repo_to_merge/ -u repo_to_merge/master`
6. `git commit -am "Merge repo_to_merge content"`
7. Voilà!

## How to pull updates from the original repo that was merged in

Yes, that's possible too. For instance if you kept the original repo
locally after deleting its remote on GitHub. You could make some changes
in the standalone original repo, then pull those changes into the Library
like this:

`git pull -s subtree repo_to_merge master`

Ideally though, you should delete the original repo, pour one out for it,
and move on.
