# T-Mobile Coding Challenge

### Important! Read this First !

Do **not** submit a pull request to this repository.  You PR wil be rejected and your submission ignored.

To _properly_ submit a coding challenge you must:

1. fork this repository
2. make the necessary changes
3. push changes to your forked origin 
4. send address of your fork to t-mobile.

We will review your fork online before and during your interview.


# Stocks coding challenge

## How to run the application

There are two apps: `stocks` and `stocks-api`.

- `stocks` is the front-end. It uses Angular 7 and Material. You can run this using `yarn serve:stocks`
- `stocks-api` uses Hapi and has a very minimal implementation. You can start the API server with `yarn serve:stocks-api`

A proxy has been set up in `stocks` to proxy calls to `locahost:3333` which is the port that the Hapi server listens on.

> You need to register for a token here: https://iexcloud.io/cloud-login#/register/ Use this token in the `environment.ts` file for the `stocks` app.

> The charting library is the Google charts API: https://developers.google.com/chart/

## Problem statement

[Original problem statement](https://github.com/tmobile/developer-kata/blob/master/puzzles/web-api/stock-broker.md)

### Task 1

Please provide a short code review of the base `master` branch:

1. What is done well?
2. What would you change?
3. Are there any code smells or problematic implementations?

#My Aswer to Task 1:
1. The use of $ to name observables is consistent. Every observable that has not been subscribed should have a $ in front. It is common naming convention defined by Google. Also what is done well is that higher level components contain more complex business logic than child components making the components 'simple', 'testable', and maintainable. For example the the observable $data is passed into the chart component versus having the chart component fetching the data directly. This allows the component to be re-usable in a lot more use cases.
2. What would I change? NgRx is a complex architecture for such a simple application. I would have not selected this architecture for such a simple tasks. I understand NgRx was implemented to be able to update and keep track of state in 1 place. In that case, NgRx becomes advantageous. In a SPA (single page application) keeping track of state and updating state is critically important for real time applications. For example, keeping track of notifications within facebook. That's why React and Redux was created because the problem of a single source of truth was introduced. NgRx or Redux architectures help solve the problem of keeping track of state for things that need to update (common use case is notifications in facebook) in real time. This is what I have noticed in the past. The drawback, is look at how much code one has to write in order to implement such a small get request form the store, you'll need to dispatch, have an actions file, effects, facade, reducer, selector, and a transformer. In my humble opinion, there better be a good reason to implement a more complicated architecture if it is required.
3. The biggest problemematic thing I see is how the application is structured. Unless the libs folder is truely a separate library being maintained outside of this project, I would not have put it there but would have put it within app. There is also no routes file, this makes it easier for other developers to quickly see what is being routed in the application. Another bug I found was that the chart component was not working when I first pulled down the code from github. I have fixed this in my commit. I also noticed some unused variables. .vscode was commited. Seems sloppy to have that in the repo. Github noticed a high security vulnerability with axios <- 0.18.0. I also noticed that the project is in Angular 7, should be upgraded to Angular 8. I would not have grouped stocks and stocks-api within the same repository but seeing this is a developer puzzle, it makes sense that these are grouped together. I would have given stocks-api it's own package.json and put it in a separate repository. It's not good practice to have front end code and backend on the same repository. As well, when things get more complex and harder to scale, this becomes more of an issue. 


> Make a PR to fix at least one of the issues that you identify

### Task 2

```
Business requirement: As a user I should be able to type into
the symbol field and make a valid time-frame selection so that
the graph is refreshed automatically without needing to click a button.
```

_**Make a PR from the branch `feat_stock_typeahead` to `master` and provide a code review on this PR**_

> Add comments to the PR. Focus on all items that you can see - this is a hypothetical example but let's treat it as a critical application. Then present these changes as another commit on the PR.

### Task 3

```
Business requirement: As a user I want to choose custom dates
so that I can view the trends within a specific period of time.
```

_**Implement this feature and make a PR from the branch `feat_custom_dates` to `master`.**_

> Use the material date-picker component

> We need two date-pickers: "from" and "to". The date-pickers should not allow selection of dates after the current day. "to" cannot be before "from" (selecting an invalid range should make both dates the same value)

### Task 4

```
Technical requirement: the server `stocks-api` should be used as a proxy
to make calls. Calls should be cached in memory to avoid querying for the
same data. If a query is not in cache we should call-through to the API.
```

_**Implement the solution and make a PR from the branch `feat_proxy_server` to `master`**_

> It is important to get the implementation working before trying to organize and clean it up.
