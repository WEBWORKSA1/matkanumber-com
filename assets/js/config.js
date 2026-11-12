/* MatkaNumber site settings. Edit this file to change payment links, prizes and puzzles. */
window.MN = {
  /* Form relay: the owner inbox, encoded so the address never appears in any page.
     After the first FormSubmit activation, paste the random alias FormSubmit gives you
     into formAlias and the encoded value below is no longer used. */
  relay: ["=02bj5CbpF", "WbnBUMhN3a", "y92diV2d"],
  formAlias: "",
  ownerContact: "https://web.works/contact",
  /* Payment links for the Support page. Leave empty to run in pledge mode. */
  payments: { paypal: "", stripe: "", buymeacoffee: "", kofi: "", razorpay: "", upi: "" },
  /* Monthly contest: prize text and one puzzle per month (January = index 0). */
  prize: "A featured winner spot on the site plus the sponsor prize of the month, announced here when confirmed",
  puzzles: [
    "A pot holds chits 00 to 99. How many of them have two identical digits?",
    "What is the smallest number that 1, 2, 3, 4, 5 and 6 all divide exactly?",
    "Two fair dice are rolled. Out of 36 outcomes, how many give a total of 8?",
    "How many prime numbers are there between 1 and 50?",
    "A pot holds chits 1 to 100. How many are multiples of 3 or 5?",
    "Write 2026 in binary. How many 1s does it contain?",
    "How many two-digit numbers have digits that add up to 9?",
    "Three chits are drawn from 0 to 9 with replacement. How many different ordered results are possible?",
    "What is the sum of all whole numbers from 1 to 99?",
    "How many numbers from 1 to 100 are perfect squares or perfect cubes?",
    "One lakh divided by one hundred, then multiplied by seven. What is the result?",
    "A coin is flipped 5 times. How many of the 32 outcomes contain exactly two heads?"
  ]
};
