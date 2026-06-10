# Frontend Developer Task: ConFiPay Treasury UI Refinement

## Overview

We're looking to improve the user experience in our Treasury module. Your task is to refine the deposit/withdraw interaction flow and fix UX issues that users have reported. This is a practical task that assesses your ability to work with existing component systems and improve real-world UI problems.

**Time: 1 to 1.5 hours**

---

## The Problem

Our Treasury page currently has these user-facing issues:

1. **Unclear transaction flow** - Users aren't sure whether they're depositing or withdrawing until deep in the form
2. **Poor form feedback** - Empty states and error states aren't visually distinct enough
3. **Button clarity** - Primary actions (submit) vs secondary actions (cancel) aren't hierarchically clear
4. **Loading experience** - No indication that a transaction is processing
5. **Mobile layout breaks** - The card layout shifts awkwardly on tablets/phones

---

## Your Task

### Part 1: Fix the Deposit/Withdraw Cards (45-50 minutes)

Improve `src/pages/TreasuryPage.tsx`:

1. **Visual hierarchy** - Make it immediately obvious which action (deposit vs withdraw) is selected
   - Add a subtle background color or border change when "Deposit" or "Withdraw" is active
   - Consider using the existing button component more intentionally

2. **Form state feedback** - Add visual distinction for:
   - Empty form state (no input yet)
   - Filled form state (ready to submit)
   - Disabled state (e.g., when amount exceeds balance)
   - Loading state (disabled button with visual indicator)

3. **Responsive improvement** - Ensure the deposit/withdraw cards stack better on mobile
   - Cards should be single-column on screens < 640px
   - Padding/spacing should adapt

### Part 2: Polish One Detail (10-15 minutes)

Choose one of these to refine:

- **Button text clarity** - Make action buttons more specific (e.g., "Submit Deposit" instead of generic "Submit")
- **Input labels** - Add helpful hints or floating labels if they're currently static
- **Success/error feedback** - If a transaction completes, show brief feedback before clearing the form
- **Accessibility** - Ensure form fields have proper `aria-labels` and that color isn't the only indicator of state

---

## What You Have to Work With

- **Components**: `src/components/` contains reusable UI building blocks
- **Styling**: `src/styles.css` - use Tailwind utility classes (already configured)
- **Page**: `src/pages/TreasuryPage.tsx` - main component to modify
- **Button/Form primitives**: Check `src/components/ui/` for existing components

---

## Acceptance Criteria

✓ The deposit/withdraw toggle has clear visual feedback for active state  
✓ Form inputs are clearly labeled and distinguish between filled/empty/error states  
✓ The button hierarchy is obvious - submit action stands out  
✓ Layout is single-column on mobile, adapts gracefully at different breakpoints  
✓ At least one accessibility improvement is implemented (aria-labels, semantic HTML, color + icon indicators, etc.)  
✓ Code is clean and follows the existing style conventions  
✓ Changes don't break other parts of the Treasury page  

---

## Deliverables

1. **Updated TreasuryPage.tsx** - Your improved component
2. **A brief note** (3-5 sentences) explaining:
   - What issue you prioritized and why
   - The specific improvement you made
   - How it improves the user experience

---

## Tips

- Look at the existing button and card components - they're already styled and accessible
- Tailwind classes are your friend for responsive design (check `src/styles.css` for utilities)
- The mock data in `backend/models/mockData.js` shows what treasury data looks like
- Focus on one coherent improvement rather than multiple surface-level changes
- Keep the existing functionality intact - this is a polish task, not a rewrite

---

## What We're Evaluating

- **UI/UX thinking** - Do you understand why the change improves the experience?
- **Component literacy** - Can you work confidently with existing systems?
- **Attention to detail** - Is the implementation polished and consistent?
- **Accessibility awareness** - Do you consider keyboard users, screen readers, and color-blind users?
- **Responsive design** - Does it work well at different viewport sizes?
- **Code quality** - Is it maintainable and following conventions?

---

## Getting Started

1. Review the Treasury page structure
2. Identify the primary pain point
3. Plan your improvement (sketch if needed)
4. Implement using existing components
5. Test your changes across breakpoints
6. Write your brief explanation

**Good luck!**
