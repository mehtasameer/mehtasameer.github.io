
# Introduction to Mechanism Design

Sameer Mehta | ERIM Summer School 2026 | Day 3

## Bayesian mechanism design

### Set up

- one item, one seller, indivisible good
- multiple buyers: $\mathcal{I} = \{1, 2, \ldots, N\}$; $N\geq 2$
- private type of buyer $i$: $\theta_i$
- buyer $i$'s utility if she obtains the good and pays $p_i$: $\theta_i - p_i$
- if she does not participate: $0$
- utility is quasi-linear in payment

### Private information
- buyer $i$ knows her type $\theta_i$; other buyers and the seller do not know her type
- they (other buyers and the seller) only have distributional information (common prior)

^^^

- $\theta_i$ is distributed with CDF $F_i$ and PDF $f_i$ on support $[\underline{\theta}, \overline{\theta}]$
- $\theta_1, \theta_2, \ldots, \theta_N$ are mutually independent; we do not assume they are identically distributed
- $f_i(\theta_i) > 0$ for all $i \in \mathcal{I}, \theta_i \in [\underline{\theta}, \overline{\theta}]$
- $\boldsymbol{\theta} = (\theta_1, \theta_2, \ldots, \theta_N)$; $\Theta = [\underline{\theta}, \overline{\theta}]^N$
- let $F, f$ denote the CDF and PDF of  $\boldsymbol{\theta}$

### Notation: the other buyers
- it is convenient to separate buyer $i$ from her opponents
- $\boldsymbol{\theta}_{-i}$: the vector of all types except buyer $i$'s

$$\boldsymbol{\theta}_{-i} = (\theta_1, \ldots, \theta_{i-1}, \theta_{i+1}, \ldots, \theta_N), \qquad \boldsymbol{\theta} = (\theta_i, \boldsymbol{\theta}_{-i})$$

- opponents' type space: $\boldsymbol{\Theta}_{-i} = [\underline{\theta}, \overline{\theta}]^{N-1}$
- their joint density is $f_{-i}$, and by independence

$$f_{-i}(\boldsymbol{\theta}_{-i}) = \prod_{j \neq i} f_j(\theta_j)$$

### Mechanisms

- we are interested in procedures that the seller can use 
- negotiation, auction, lotteries, posted price, other mechanisms
- we consider a broad class of mechanisms
	- allow the seller to pick an arbitrary extensive game tree
	- commit to a strategy; so the buyers are the players in the game
	- such a game is referred to as a 'mechanism'

^^^
- the buyers now play against one another
- this is a game of incomplete information; we need an equilibrium concept for it

### Bayesian Nash equilibrium
- with a single buyer (day 1) there was no one to play against — just an optimization
- with many buyers, each must reason about what the others will do
- but a buyer cannot see her opponents' types, and their actions depend on those types
- so each buyer must act on her beliefs about the others

### Nash equilibrium
- solution concept for complete information
- every player knows all the payoffs
- a profile of actions is a Nash equilibrium if no player gains by deviating, holding the others fixed

^^^

- each player best responds to the actual actions of the others
- beliefs play no role: everything relevant is common knowledge

### Strategies with private types
- a buyer must choose how to act before learning other players' types
- she does know her own type
- so her plan must specify an action for each type she might be
- buyer $i$'s strategy: a function $\sigma_i$ from her type to an action, $\theta_i \mapsto \sigma_i(\theta_i)$
- write $\sigma_{-i}$ for the strategies used by all buyers other than $i$

### Bayesian Nash equilibrium: the idea
- fix buyer $i$ of type $\theta_i$
- she does not observe $\boldsymbol{\theta}_{-i}$, the vector of her opponents' types
- she holds the common prior over $\boldsymbol{\theta}_{-i}$ (by independence, just $f_{-i}$)
- and, as equilibrium requires, correctly anticipates the opponents' strategies $\sigma_{-i}$
- together these induce a distribution over the opponents' actions
- she best responds to that distribution — in expectation, not to any single realization

### Bayesian Nash equilibrium: definition
- a profile $\sigma = (\sigma_1, \ldots, \sigma_N)$ is a Bayesian Nash equilibrium if, for every buyer $i$ and every type $\theta_i$
  - $\sigma_i(\theta_i)$ maximizes $i$'s expected utility
  - the expectation is taken over $\boldsymbol{\theta}_{-i}$ using the common prior
  - holding fixed that the opponents play $\sigma_{-i}$
^^^
- one best-response condition for each type of each buyer
- every type acts optimally against the 'average behaviour' of the rivals

### Bayesian Nash vs. Nash

- Nash: best respond to opponents' actions, which are known
- Bayesian Nash: best respond to a distribution over opponents' actions, induced by their types and strategies
- Nash: one best-response condition per player
- Bayesian Nash: one condition per type of each player — a plan, not a single action
- if each buyer had only one possible type, opponents' types would be known and the two notions coincide

### Direct mechanism
- let $\Delta$ denote the set of all probability distributions over the set $\mathcal{I}$ (and no sale)
$$\Delta:= \left\{(q_1, q_2, \ldots, q_N) | 0 \leq q_i \leq 1~\forall i \in \mathcal{I}; \sum_{i\in \mathcal{I}}q_i \leq 1\right\}$$ 
- probability that the good is not sold: $1 - \sum_{i\in \mathcal{I}}q_i$
- a direct mechanism consists of functions $q$ and $p_i$ (for all $i \in \mathcal{I}$)
	- allocation function $q: \Theta \rightarrow \Delta$
	- payment function $p_i: \Theta \rightarrow \mathbb{R}$ for $i \in \mathcal{I}$
- buyers are asked to simultaneously and independently report their own types

### Direct mechanism
- allocation rule $q(\boldsymbol{\theta})$: rule by which the good is allocated if reported vector is $\boldsymbol{\theta}$
- write $q(\boldsymbol{\theta}) = \left(q_1(\boldsymbol{\theta}), q_2(\boldsymbol{\theta}), \ldots, q_N(\boldsymbol{\theta})\right)$

^^^
- $q_i(\boldsymbol{\theta})$: the probability with which buyer $i$ obtains the good (when reported vector is $\boldsymbol{\theta}$)
- $p_i(\boldsymbol{\theta})$: the payment made by buyer $i$ to the seller (when reported vector is $\boldsymbol{\theta}$)

### Buyer utility in a direct mechanism
- we would be looking for truth-telling to be a Bayesian Nash equilibrium
- so, hold the opponents at truthful reporting: their reports are their types $\boldsymbol{\theta}_{-i}$
- only buyer $i$ contemplates a deviation — reporting $\theta_i'$ while her true type is $\theta_i$
- she then obtains the good with probability $q_i(\theta_i', \boldsymbol{\theta}_{-i})$ and pays $p_i(\theta_i', \boldsymbol{\theta}_{-i})$
- her ex post utility is

$$u_i(\theta_i', \boldsymbol{\theta}_{-i};\, \theta_i) := \theta_i\, q_i(\theta_i', \boldsymbol{\theta}_{-i}) - p_i(\theta_i', \boldsymbol{\theta}_{-i})$$

- compare day 1, $\theta \cdot q(\theta') - p(\theta')$: now the opponents' types $\boldsymbol{\theta}_{-i}$ enter as an extra argument
- quasi-linear in payment, as before
- but $i$ does not know $\boldsymbol{\theta}_{-i}$, so she cannot evaluate this directly — she must take expectations

### Revelation principle
- we are searching over an enormous class of mechanisms — every extensive game the seller could run
- WLOG, restrict attention to direct mechanisms
- the only change: the solution concept is now Bayesian Nash equilibrium, not single-agent optimization

### Proposition: Revelation principle
>- for every mechanism $\Gamma$ and every Bayesian Nash equilibrium $\sigma = (\sigma_1, \ldots, \sigma_N)$ of $\Gamma$, there is a direct mechanism $\Gamma'$ and a Bayesian Nash equilibrium $\sigma'$ of $\Gamma'$, such that
>- truth-telling is an equilibrium: $\sigma_i'(\theta_i) = \theta_i$ for every $i \in \mathcal{I}$ and every $\theta_i$
>- the outcome is unchanged: for every type vector $\boldsymbol{\theta}$
	> - the allocation $q(\boldsymbol{\theta})$ and interim expected payments $P_i(\theta_i)$ under $\Gamma'$ equal the distribution over outcomes and expected payments generated by $\sigma$ in $\Gamma$

### Revelation principle
- collapses the search over all extensive games into a search over truthful direct mechanisms
- a direct mechanism we can keep: truth-telling is a BNE and every type's 'interim utility' is non-negative
- we will impose these as the incentive-compatibility (IC) and individual-rationality (IR) constraints next



### The vantage point of buyer $i$
- from here on, everything is written from buyer $i$'s point of view
- she knows her own $\theta_i$, but not $\boldsymbol{\theta}_{-i}$
- so she evaluates any mechanism by taking expectation over $\boldsymbol{\theta}_{-i}$ with the density $f_{-i}$

^^^

- three stages of the game, distinguished by what is known
  - ex ante: before anyone has learned their type
  - interim: $i$ knows $\theta_i$, but not $\boldsymbol{\theta}_{-i}$
  - ex post: all types are realized and reported
- buyer $i$ chooses her report at the interim stage — knowing $\theta_i$, uncertain about the rest
- so the interim stage is the right vantage point for her incentives

### Interim allocation and payments
- take the ex post allocation $q_i(\theta_i, \boldsymbol{\theta}_{-i})$ and average the opponents out
- interim expected probability that $i$ obtains the good

$$Q_i(\theta_i) := \int_{\boldsymbol{\Theta}_{-i}} q_i(\theta_i, \boldsymbol{\theta}_{-i})\, f_{-i}(\boldsymbol{\theta}_{-i})\, d\boldsymbol{\theta}_{-i}$$

- interim expected payment made by $i$

$$P_i(\theta_i) := \int_{\boldsymbol{\Theta}_{-i}} p_i(\theta_i, \boldsymbol{\theta}_{-i})\, f_{-i}(\boldsymbol{\theta}_{-i})\, d\boldsymbol{\theta}_{-i}$$

- both fix $i$'s type at $\theta_i$ and integrate out the opponents
- so each is conditional on $i$'s type being $\theta_i$

### Interim allocation and payments
- $Q_i(\theta_i)$ is the win probability that type $\theta_i$ actually faces
  - it already folds in the competition from the other buyers
- $P_i(\theta_i)$ is the payment that type $\theta_i$ expects to make
  - expectation over whatever the opponents turn out to report

^^^
- from $i$'s vantage point these two numbers summarize the entire mechanism
- importantly, both depend on her own type $\theta_i$ alone
- so, seen through $Q_i$ and $P_i$, the multi-buyer problem looks like the single-buyer problem of day 1
  - $Q_i$ plays the role of $q$, and $P_i$ the role of $p$

### Interim utility
- buyer $i$ of type $\theta_i$, reporting truthfully, expects

$$U_i(\theta_i) := \theta_i\, Q_i(\theta_i) - P_i(\theta_i)$$

- this is the interim expectation of her ex post utility $u_i(\theta_i, \boldsymbol{\theta}_{-i};\, \theta_i)$
- quasi-linear
- everything is now written in $i$'s own interim terms

### Incentive compatibility
- a direct mechanism is incentive-compatible if truth-telling is a Bayesian Nash equilibrium
- fix the opponents reporting truthfully
  - then $i$ of type $\theta_i$ cannot gain by reporting some $\theta_i'$ instead

$$\theta_i\, Q_i(\theta_i) - P_i(\theta_i) \ge \theta_i\, Q_i(\theta_i') - P_i(\theta_i') \quad \forall\, i \in \mathcal{I},\; \theta_i, \theta_i' \in [\underline{\theta}, \overline{\theta}]$$

- LHS: report the truth; RHS: deviation to a false report $\theta_i'$
- the expectation already integrates out $\boldsymbol{\theta}_{-i}$, so this is an interim comparison
- this is exactly the Bayesian Nash condition, written for the truthful direct mechanism

### Individual rationality
- a direct mechanism is individually rational if every type is willing to participate

$$U_i(\theta_i) \ge 0 \quad \forall\, i \in \mathcal{I},\; \theta_i \in [\underline{\theta}, \overline{\theta}]$$

- evaluated at the interim stage: interim individual rationality
- the outside option is normalized to zero utility

## Characterizing IC and IR

### The single-buyer analysis carries over
- through $i$'s vantage point the problem is the day-1 problem, one buyer at a time
- $Q_i, P_i, U_i$ play the roles of $q, p, u$
- so all the results hold from day 1, buyer by buyer
  - monotonicity: IC forces $Q_i$ to be increasing
  - envelope: $U_i'(\theta_i) = Q_i(\theta_i)$ where differentiable
  - payoff and revenue equivalence: $U_i$ and $P_i$ are pinned down by $Q_i$ and the lowest type
- nothing new to prove

### Proposition 1: characterizing IC

> a direct mechanism $(q, p_1, \ldots, p_N)$ is incentive-compatible if and only if, for every $i \in \mathcal{I}$
> - $Q_i$ is increasing, and
> - for every $\theta_i \in [\underline{\theta}, \overline{\theta}]$
> $$P_i(\theta_i) = \theta_i Q_i(\theta_i)  - \int_{\underline{\theta}}^{\theta_i} Q_i(x)\, dx - \big( \underline{\theta}\, Q_i(\underline{\theta}) - P_i(\underline{\theta})\big) $$

### Proposition 1: what it says
- the seller has just two free choices per buyer
  - the allocation rule $q$, subject to each $Q_i$ increasing
  - the lowest type's interim expected payment $P_i(\underline{\theta})$
- once these are fixed, every type's interim payment is determined
- so two mechanisms with the same interim allocation and the same lowest-type payment raise the same revenue
- revenue equivalence, now stated buyer by buyer
- the ex post payments $p_i$ are not unique: many $p_i$ give the same $P_i$

### Proposition 2: characterizing IR
- restrict attention to IC direct mechanisms

> such a mechanism is individually rational if and only if, for every $i \in \mathcal{I}$
> $$P_i(\underline{\theta}) \le \underline{\theta}\, Q_i(\underline{\theta}), \qquad \text{equivalently} \quad U_i(\underline{\theta}) \ge 0$$

### Proposition 2: what it says
- since $U_i$ is increasing, checking the lowest type is enough
- IR adds a single constraint per buyer: the lowest type must not be left with negative rent
- together, Propositions 1 and 2 reduce the design problem to
  - an increasing interim allocation for each buyer
  - a lowest-type payment that respects participation
- same as day 1, now buyer by buyer


### Optimal (revenue-maximizing) mechanism
- the seller maximizes expected revenue among IC, IR mechanisms
- IR binds at the bottom: leave the lowest type zero rent, $P_i(\underline{\theta}) = \underline{\theta}\, Q_i(\underline{\theta})$
- Proposition 1 then fixes every payment from the allocation alone
- substitute into $\sum_{i \in \mathcal{I}} \mathbb{E}[P_i(\theta_i)]$ and integrate by parts, exactly as in day 1
- expected revenue becomes expected virtual surplus

$$\mathbb{E}\Big[\textstyle\sum_{i \in \mathcal{I}} \psi_i(\theta_i)\, q_i(\boldsymbol{\theta})\Big], \qquad \psi_i(\theta_i) := \theta_i - \frac{1 - F_i(\theta_i)}{f_i(\theta_i)}$$


### Optimal mechanism
- maximize the virtual surplus pointwise, state by state
- give the good to the buyer with the highest virtual value, provided it is positive

$$q_i^*(\boldsymbol{\theta}) = 1 \iff \psi_i(\theta_i) > \max\Big\{\,0,\ \max_{j \neq i} \psi_j(\theta_j)\,\Big\}$$

- withhold the good when every virtual value is negative — a reserve at $\psi_i = 0$
- under regularity ($\psi_i$ increasing) each $Q_i$ is increasing, so monotonicity holds for free
- without regularity, iron $\psi_i$ first

### Optimal mechanism: reserve price

- under regularity, the optimal rule is simple in virtual values
- suppose buyers are symmetric: $F_i = F$ for all $i$, hence $\psi_i = \psi$ for all $i$
- since $\psi$ is increasing, ranking buyers by $\psi(\theta_i)$ is the same as ranking them by $\theta_i$
- define the reserve type $r$ by

$$\psi(r) = 0$$

- then the optimal allocation becomes

$$q_i^*(\boldsymbol{\theta}) = 1 \iff \theta_i = \max_j \theta_j \text{ and } \theta_i > r$$

- ties can be broken arbitrarily; with continuous types they occur with probability zero
- so in the symmetric regular case: the optimal allocation is the second-price allocation with reserve price $r$

### The payment rule

- payments are pinned down by IC once the allocation rule is fixed

$$p_i^*(\boldsymbol{\theta}) =
\begin{cases}
\max\{r,\ \max_{j \neq i}\theta_j\}, & \text{if } i \text{ wins},\\
0, & \text{otherwise.}
\end{cases}$$

- this is exactly a second-price auction with reserve price $r$


### If buyers are asymmetric

- if $F_i$ differs across buyers, then $\psi_i$ differs across buyers
- the optimal rule is still

$$q_i^*(\boldsymbol{\theta}) = 1 \iff \psi_i(\theta_i) > \max\Big\{0,\ \max_{j \neq i}\psi_j(\theta_j)\Big\}$$

^^^
- but this need not rank buyers by their raw values
- a lower-value buyer with a higher virtual value may win
- payment rule

$$p_i^*(\boldsymbol{\theta}) =
\max\left\{\underline{\theta},\ \psi_i^{-1}\Big(\max\{0,\ \max_{j \neq i}\psi_j(\theta_j)\}\Big)\right\}
\quad \text{if } i \text{ wins}$$

- with the convention that $\psi_i^{-1}(0)$ is buyer $i$'s reserve type
- so the general optimal mechanism is a second-price auction in virtual values with buyer-specific reserve types

## Public goods

### Setup
- historically, this is where Bayesian mechanism design began

^^^

- a community $\mathcal{I} = \{1, 2, \ldots, N\}$, $N \geq 2$, decides whether to produce a public good
- decision variable $g \in \{0, 1\}$: produce ($g=1$) or not ($g=0$)
- the good is indivisible and nonexcludable
  - nonexcludable: the same $g$ enters everyone's utility — no one can be excluded once it is built
- agent $i$'s utility if the decision is $g$ and she pays $p_i$ to the community

$$\theta_i\cdot g - p_i$$

- type $\theta_i$: agent $i$'s valuation of the public good
- examples: a bridge, streetlights, herd immunity, a wikipedia article

### Setup: information and cost
- independent private values: $\theta_i \sim F_i$ on $[\underline{\theta}, \overline{\theta}]$, with $0 \leq \underline{\theta} < \overline{\theta}$ and $f_i > 0$
  - $\theta_i$'s independent across agents; $i$ observes only her own $\theta_i$
- producing the good costs $c > 0$, so decision $g$ implies cost $c\,g$
- a benevolent designer who knows $F$ but not $\theta$; utilitarian welfare, equal weights
- welfare is the sum of agents' payoffs; the money she raises is not returned
$$W = \sum_{i \in \mathcal{I}} (\theta_i\, g - p_i) = \Big(\sum_{i \in \mathcal{I}} \theta_i\Big) g - \sum_{i \in \mathcal{I}} p_i$$

- the designer maximizes $\mathbb{E}[W]$; the cost $c$ enters not through $W$ but through the budget constraint, $\sum_i p_i \geq c\, g$

### What is new?
- in the auction, the only constraints were IC and IR
- here a third constraint enters: a budget constraint
  - the money raised must cover the cost of building the good

^^^
- this is the heart of the public-goods problem — and the source of the free-rider difficulty
  - everyone wants the good built, but each prefers the others to pay for it
  - eliciting honest valuations and funding the good will turn out to be in tension
- methodologically: our first example of optimizing subject to a constraint beyond IC and IR

### Direct mechanisms
- revelation principle holds, as before — restrict, WLOG, to direct mechanisms
- a direct mechanism is a decision rule and payments

$$q : \Theta \to \{0, 1\}, \qquad p_i : \Theta \to \mathbb{R} \quad (i \in \mathcal{I})$$

- $q(\boldsymbol{\theta})$: whether the good is built when reports are $\boldsymbol{\theta}$
- $p_i(\boldsymbol{\theta})$: the payment agent $i$ makes to the community

### IC and IR: same machinery as the auction
- define, exactly as before, the interim objects conditional on $\theta_i$
  - $Q_i(\theta_i)$: interim probability the good is produced
  - $P_i(\theta_i)$: interim expected payment
  - $U_i(\theta_i) = Q_i(\theta_i)\,\theta_i - P_i(\theta_i)$: interim expected utility
- so IC and IR are characterized by the same results
  - IC $\iff$ $Q_i$ increasing and the revenue-equivalence (envelope) formula for $P_i$
  - IR $\iff$ the lowest type's interim utility is non-negative
- nothing new here

### Budget balance: two versions
- the new constraint: revenue must cover cost
^^^
- ex post budget balance — holds state by state

$$\sum_{i \in \mathcal{I}} p_i(\boldsymbol{\theta}) \geq c\, q(\boldsymbol{\theta}) \qquad \forall\, \boldsymbol{\theta} \in \Theta$$

- ex ante budget balance — holds only on average

$$\int_{\Theta} \sum_{i \in \mathcal{I}} p_i(\boldsymbol{\theta})\, f(\boldsymbol{\theta})\, d\boldsymbol{\theta} \;\geq\; \int_{\Theta} c\, q(\boldsymbol{\theta})\, f(\boldsymbol{\theta})\, d\boldsymbol{\theta}$$

- clearly ex post $\Rightarrow$ ex ante; ex post looks strictly more demanding

### The two are equivalent here

> Proposition: for every ex ante budget balanced mechanism there is an equivalent ex post budget balanced one (same decision rule, same interim expected payment for every type and every report).

^^^
- ex ante balance can always be upgraded to ex post
- equivalent mechanisms inherit each other's IC and IR
- so requiring ex post balance costs the designer nothing beyond ex ante balance
- we may freely work with whichever is more convenient

### Upgrading ex ante to ex post: proof sketch

- the claim: any ex ante balanced mechanism can be rewritten to balance ex post

^^^
- ex ante balance controls only the average; in state by state, a gap remains
- call the shortfall in state $\boldsymbol{\theta}$ as the deficit

$$D(\boldsymbol{\theta}) := c\, q(\boldsymbol{\theta}) - \sum_{i \in \mathcal{I}} p_i(\boldsymbol{\theta})$$

^^^

- ex ante balance says $\mathbb{E}[D(\boldsymbol{\theta})] \le 0$
	- if the mechanism collects more than it needs on average, we can lower payments by a fixed amount without changing incentives, so take the average deficit to be exactly zero, $\mathbb{E}[D(\boldsymbol{\theta})] = 0$
- idea: add corrections to the payments that erase $D(\boldsymbol{\theta})$ everywhere, leaving incentives intact

### Proof sketch

- pick two agents to absorb the deficit; everyone else pays exactly as before

^^^
- agent 1 pays an extra $D(\boldsymbol{\theta}) - \mathbb{E}[D \mid \theta_1]$, with the conditional average taken over the others' types
  - for any report she sends, this extra averages to exactly zero
  - independence is the key: her report does not move the others' distribution, so it holds report by report, not just at the truth
^^^
- agent 2 pays an extra $\mathbb{E}[D \mid \theta_1]$
  - it depends on agent 1's report, not on her own

^^^
- the two corrections sum to $D(\boldsymbol{\theta})$ in every state, so the budget now balances ex post
- why? because of risk neutrality: a fair bet leaves expected payoffs, and hence IC and IR, unchanged

### Welfare: the first best
- the first best is a benchmark: what a designer could do if she observed every $\theta_i$ directly
- with full information, there is no incentive problem and no participation problem
  - she simply chooses the decision and the payments that maximize welfare
- transfers subtract from $W$, so she raises no more than the budget needs: $\sum_i p_i = c$, when building
  - welfare then reduces to total value net of cost, $\big(\sum_i \theta_i - c\big)g$

### The first-best rule
- the decision maximizes total value net of cost, state by state

$$q^*(\boldsymbol{\theta}) = 1 \iff \sum_{i \in \mathcal{I}} \theta_i \geq c$$

- build exactly when the good is worth more to the community than it costs
- payments: any rule with $\sum_i p_i(\boldsymbol{\theta}) = c$ when the good is built, $0$ otherwise
- this is the highest welfare attainable, so we call it the first best



### Three properties in tension
- throughout, we work with direct, IC mechanisms
  - by the revelation principle this is WLOG
- on top of IC, we would like to have the following properties
  - efficiency: implement the first-best decision $q^*$
  - individual rationality: every type is willing to participate
  - budget balance: payments cover cost, $\sum_i p_i(\boldsymbol{\theta}) \geq c\, q(\boldsymbol{\theta})$

^^^
- each is reasonable on its own; the question is whether all three can hold together


### An impossibility result

> Proposition: a mechanism that is efficient, IC, IR, and budget balanced exists if and only if $N\underline{\theta} \geq c$ or $N\overline{\theta} \leq c$.

^^^

 - $N\underline{\theta} \geq c$: even the lowest valuations cover cost — always build, charge $c/N$ each
 - $N\overline{\theta} \leq c$: even the highest valuations fall short — never build

^^^
- what is impossible: in the nontrivial case $N\underline{\theta} < c < N\overline{\theta}$, no mechanism has all four properties at once
- when the decision is already fixed (always build or never build) reports no longer affect the outcome, so incentive compatibility is automatic



### What the impossibility means
- efficiency, voluntary participation, and a balanced budget cannot hold at once
- something must give — keep any three by sacrificing the fourth
  - build inefficiently (giving up efficiency), or
  - subsidize the good from outside (giving up budget balance), or
  - force agents to participate (giving up individual rationality)

### Why: the free-rider problem
- the impossibility result connects to the free-rider problem 
  - each agent benefits from the good but would rather have the others pay
  - to make truth-telling optimal, the mechanism must give each agent an information rent
  - those rents stay with the agents instead of being collected to pay for the good
  - so the mechanism cannot raise enough revenue to cover the cost

^^^
- contrast the auction: revenue goes to the seller, so raising more money is the objective, not a constraint
- here payments must pay for the public good itself, so the mechanism has to raise enough to cover the cost

### From free-riding to a proof
- the free-rider story is intuition; the impossibility still needs a proof

^^^
- strategy: construct the efficient mechanism that keeps truth-telling optimal and agents willing to participate, and raises as much revenue as it can
  - it is efficient, IC, and IR by construction
  - the only open question is whether its revenue covers the cost

^^^
- if even this best case runs a deficit, no efficient IC IR mechanism can balance the budget
  - the impossibility then follows from a single, well-chosen mechanism
- so we first have to build that mechanism

### What the mechanism must do
- efficiency and IR we can impose directly
- the hard part is IC: truth-telling must be optimal even though each agent would rather free-ride

^^^
- so we need a way to tie each agent's private incentive to total welfare
  - if her payoff moves with welfare, truth-telling and efficiency coincide
- the next slides construct exactly such a mechanism

### Aligning incentives with welfare
- the idea: make each agent internalize her effect on everyone else
  - charge her so that her private payoff tracks total welfare
  - then maximizing her own payoff is the same as maximizing welfare
  - so she reports her true type — whatever the others do

^^^
- this is a strong form of IC: truth-telling is a dominant strategy, not merely a Bayesian one
- three classical mechanisms: Groves, Clarke, Vickrey

### Groves mechanism: the payment

- implement the efficient decision $q^*$, and pay each agent

$$p_i(\boldsymbol{\theta}) = \underbrace{h_i(\boldsymbol{\theta}_{-i})}_{\text{free: any function of others' reports}} - \underbrace{\Big(\textstyle\sum_{j \neq i}\theta_j - c\Big)\, q^*(\boldsymbol{\theta})}_{\text{others' value net of cost, when the good is built}}$$

^^^
- first term $h_i(\boldsymbol{\theta}_{-i})$: a baseline fixed from $i$'s side
  - it depends on the others' reports, never on $i$'s own report

^^^
- second term: the others' total value minus the full cost, realised only if $q^* = 1$
  - the mechanism subtracts it from $i$'s payment
  - in effect it hands $i$ the rest of society's surplus from the decision

### Groves: agent $i$'s payoff
- hold the others at any reports $\boldsymbol{\theta}_{-i}$; let $i$ have true type $\theta_i$ and report $\theta_i'$
- her realised payoff is value minus payment

$$\theta_i\, q^*(\theta_i', \boldsymbol{\theta}_{-i}) - p_i = \Big(\underbrace{\theta_i + \textstyle\sum_{j\neq i}\theta_j - c}_{\text{total value net of cost}}\Big)\, q^*(\theta_i', \boldsymbol{\theta}_{-i}) \;-\; h_i(\boldsymbol{\theta}_{-i})$$

^^^
- the $h_i$ term is a constant from $i$'s side — her report cannot move it
- so, up to that constant, $i$'s payoff is exactly the total surplus from the decision
  - her own true value $\theta_i$ sits inside the bracket, alongside the others' reported values

### Groves: why truth-telling is dominant
- the only thing $i$ controls is the decision, through her report $\theta_i'$
- she would like the good built exactly when the bracket is positive
  - that is, when $\theta_i + \sum_{j\neq i}\theta_j \geq c$

^^^
- the efficient rule builds when $\theta_i' + \sum_{j\neq i}\theta_j \geq c$
- reporting $\theta_i' = \theta_i$ makes the two conditions coincide
  - the decision then maximises her own payoff, state by state

^^^
- so truth-telling is optimal whatever the others report — a dominant strategy
- the argument never used the shape of $h_i$

### Groves: the whole family
- the proof needed only that $h_i$ is independent of $i$'s report
- so every choice of the free functions $h_i(\boldsymbol{\theta}_{-i})$ yields an efficient, dominant-strategy mechanism
- Groves is this entire family — one member for each choice of the $h_i$

^^^
- the members differ only in payments, never in the decision or in incentives
- Clarke will select one particular $h_i$ 

### Clarke: pinning down the free term
- Groves fixes the efficient decision and dominant-strategy incentives, but leaves $h_i$ free
  - every choice of $h_i$ works; they differ only in who pays what
- Clarke selects $h_i$ by one principle
  - an agent pays only when her report changes the decision
  - when she is not pivotal, she pays nothing beyond a fixed baseline

^^^
- to say "changes the decision" precisely, we need a reference outcome to compare against
  - the reference: $i$ reporting the lowest type $\underline{\theta}$

### Clarke: pay the externality
- let $q^*(\underline{\theta}, \boldsymbol{\theta}_{-i})$ be the efficient decision when $i$ reports $\underline{\theta}$
  - the outcome the others reach without $i$'s input
- Clarke sets $h_i$ to the surplus attained at this reference

$$h_i(\boldsymbol{\theta}_{-i}) = \big(\underline{\theta} + \textstyle\sum_{j\neq i}\theta_j - c\big)\, q^*(\underline{\theta}, \boldsymbol{\theta}_{-i})$$

^^^
- with this $h_i$, the Groves payment collapses to a clean form
  - non-pivotal agent: pays only the fixed baseline
  - pivotal agent: pays exactly the externality she imposes on the rest
- this member of the Groves family is the Clarke, or pivot, mechanism

### Vickrey: specialize to an auction
- take the Clarke mechanism and change the setting to a single-item auction
  - $N$ buyers, one good; type $\theta_i$ is buyer $i$'s value
- the efficient decision gives the good to the highest value
  - $q^*$ awards the item to the buyer with the largest $\theta_i$

^^^
- who is pivotal? only the winner
  - drop the highest bidder and the good goes to someone else
  - drop others and nothing changes — (non-winners) are never pivotal

### Vickrey: the second-price payment
- the winner's externality is the surplus the others lose because she takes the good
  - without her, the item would go to the second-highest value
  - so the harm she imposes is exactly that second-highest value

^^^
- Clarke charges the winner her externality — the second-highest bid
- losers are non-pivotal, so they pay nothing
- this is exactly the second-price (Vickrey) auction

### VCG: one family, three names
- the three ideas nest, from specific to general

$$\underbrace{\text{Vickrey}}_{\text{Clarke in a single-item auction}}\;\subset\;\underbrace{\text{Clarke}}_{h_i:\ \text{pay only when pivotal}}\;\subset\;\underbrace{\text{Groves}}_{\text{any } h_i}$$

- this is also the order in which they were discovered
  - Vickrey (1961), then Clarke (1971), then Groves (1973)
- together they are the Vickrey–Clarke–Groves (VCG) mechanisms
- for the public good we use the Clarke (pivot) mechanism

### The pivot mechanism for the public good
- apply the Clarke mechanism to our binary build decision $q^*$
- the payment splits into a fixed baseline plus a charge that bites only when $i$ is pivotal

$$p_i(\boldsymbol{\theta}) = \underbrace{\underline{\theta}\, q^*(\underline{\theta}, \boldsymbol{\theta}_{-i})}_{\text{baseline: independent of } i\text{'s report}} + \underbrace{\big(q^*(\boldsymbol{\theta}) - q^*(\underline{\theta}, \boldsymbol{\theta}_{-i})\big)}_{=\,1 \text{ only if } i \text{ is pivotal}}\underbrace{\Big(c - \textstyle\sum_{j \neq i} \theta_j\Big)}_{\text{externality on the others}}$$



### When is an agent pivotal?
- compare two decisions: with $i$'s true report $\theta_i$, and with $i$ reporting $\underline{\theta}$
- $i$ is pivotal when the two differ — her report flips the build decision

^^^
- the only possible flip is from "do not build" to "build"
  - a higher report can switch building on, never off
- so $i$ is pivotal exactly when
  - without $i$: $\underline{\theta} + \sum_{j\neq i}\theta_j < c$
  - with $i$: $\theta_i + \sum_{j\neq i}\theta_j \geq c$

### Reading the pivot payment
- baseline term $\underline{\theta}\, q^*(\underline{\theta}, \boldsymbol{\theta}_{-i})$: what $i$ pays reporting the lowest type
  - fixed from $i$'s side (it does not move with her report)
  - zero whenever $\underline{\theta} = 0$

^^^
- pivotal indicator: equals $1$ only when $i$'s report flips the decision, relative to reporting $\underline{\theta}$
- externality term: when pivotal, $i$ pays $c - \sum_{j \neq i}\theta_j$
  - the cost net of what everyone else values the good at
  - exactly the harm she does the others by tipping them into building

^^^
- non-pivotal agents pay only the baseline 

### Why the pivot mechanism works
- the externality term ties $i$'s payoff to true social welfare
  - so truth-telling is optimal — IC in dominant strategies, the Groves property
- the baseline term is tuned so the lowest type is left exactly zero rent
  - so every type is willing to participate — the mechanism is IR

^^^
- so the pivot mechanism is efficient, IC, and IR
- the one thing it cannot guarantee is a balanced budget 

### A worked example: should we build the bridge?
- three residents, $\mathcal{I} = \{1, 2, 3\}$, decide whether to build a bridge
- cost $c = 12$; true valuations $\boldsymbol{\theta} = (2, 5, 9)$; lowest possible valuation $\underline{\theta} = 0$
  - so an agent who contributes nothing is like one who is absent, and the baseline payment is zero
- total value $\sum_i \theta_i = 16 \geq 12$, so the efficient decision is to build, $q^* = 1$
- every mechanism agrees on the decision; they differ only in what each resident pays
- the shared principle: each pays the externality her report imposes on the others

### Groves: reward each by the others' surplus
- Groves pays $p_i = h_i(\boldsymbol{\theta}_{-i}) - \big(\sum_{j \neq i}\theta_j - c\big)q^*$, with the add-on $h_i$ still free
- take the simplest choice, $h_i = 0$: the externality piece alone
  - resident 1: $-(5 + 9 - 12) = -2$, she is paid $2$
  - resident 2: $-(2 + 9 - 12) = +1$, she pays $1$
  - resident 3: $-(2 + 5 - 12) = +5$, she pays $5$
- each resident's payoff now tracks total welfare, so truth-telling is a dominant strategy
- but resident 1 is handed money — a different $h_i$ fixes that without touching incentives

### Clarke: only the pivotal pay
- choose $h_i$ so a resident pays only when pivotal — when the others alone would not build
- compare each resident's others' total against $c = 12$

| resident | others' total | pivotal? | pays |
|---|---|---|---|
| 1 | $5 + 9 = 14$ | no, $\geq 12$ | $0$ |
| 2 | $2 + 9 = 11$ | yes, $< 12$ | $12 - 11 = 1$ |
| 3 | $2 + 5 = 7$ | yes, $< 12$ | $12 - 7 = 5$ |

- same dominant-strategy incentives as any Groves mechanism
- but resident 1 now pays $0$ instead of being handed $2$ — the Clarke refinement

### Vickrey: the same idea in an auction
- swap the bridge for a single item; read $(2, 5, 9)$ as bids
- efficiency awards the item to the highest value, resident 3
- resident 3 is pivotal: without her the item would go to resident 2, worth $5$
- so she pays the value she displaces — the second-highest bid, $5$
- that is the second-price auction: the auction face of the Clarke externality rule

### Impossibility
- add up what Clarke collects: $0 + 1 + 5 = 6$
- yet the bridge costs $c = 12$ — the mechanism runs a deficit of $6$
- no efficient, IC, IR mechanism raises more revenue than this: the pivot leaves each lowest type zero rent
- so here no efficient, IC, IR, budget-balanced mechanism exists — the impossibility, in numbers

### Where the deficit comes from
- the bridge is built; each resident's realized utility is $\theta_i - p_i$
  - resident 1: $2 - 0 = 2$
  - resident 2: $5 - 1 = 4$
  - resident 3: $9 - 5 = 4$
- residents keep $2 + 4 + 4 = 10$ in surplus; only $6$ flows back as payments
- the community must still find $12$, so it absorbs the $6$ shortfall
- IC and IR leave the value with the residents as rent — that is why the budget falls short

### Closing the impossibility: proof sketch
- two facts finish the argument
  - expected revenue is largest when each lowest type keeps zero rent — the pivot mechanism attains it
  - yet in every nontrivial case its expected budget still runs a deficit
- so the best possible candidate already loses money
- therefore no efficient, IC, IR, budget-balanced mechanism can exist


