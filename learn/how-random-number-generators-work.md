---
title: How random number generators work
description: Pseudo-random, true random and cryptographic generators, and which kind the tools on this site use.
order: 5
read: 4
---
## Computers are bad at being random

A computer follows instructions exactly, which is the opposite of unpredictable. So how does a browser "pick a number"? There are three broad approaches.

## 1. Pseudo-random generators

A pseudo-random number generator (PRNG) starts from a number called a **seed** and runs it through a formula again and again. The output looks random and passes statistical tests, but if you know the seed and the formula you can reproduce the whole sequence. That is ideal for simulations and games that need a repeatable shuffle, and wrong for anything where prediction matters.

## 2. True random generators

These measure something physical that is unpredictable in practice: electrical noise, radioactive decay, atmospheric noise, even the movement of a wall of lava lamps. They are slower and need hardware, so they are usually used to produce seeds.

## 3. Cryptographic generators

A cryptographically secure generator combines both ideas. The operating system collects unpredictable physical events (timing of key presses, disk and network activity, hardware noise sources) into an entropy pool, then stretches that with an algorithm designed so that seeing past outputs does not help anyone predict the next one. This is what creates encryption keys.

## What MatkaNumber uses

Every draw on this site asks your browser for cryptographic random values. We then use **rejection sampling** to turn them into a number in your range. Here is why that step matters. A raw random value might be anywhere from 0 to 4,294,967,295. Mapping that onto, say, 0 to 99 by taking the remainder would make a few results very slightly more likely than others, because 4,294,967,296 is not a multiple of 100. Rejection sampling throws away the few raw values at the top that cause the imbalance and asks again. The result is exactly uniform.

## Can a fair generator be "beaten"?

No. That is the point of the design. There is no pattern to learn, no warm-up period and no memory of earlier draws. If a website or app claims to forecast the output of a fair draw, the claim is false.

## Test it

Use the [random number generator]({{ '/tools/random-number-generator.html' | relative_url }}) to draw 10,000 numbers from 0 to 9, download the CSV and count each digit in a spreadsheet. Each should appear close to 1,000 times, with ordinary wobble of a few dozen either way.
