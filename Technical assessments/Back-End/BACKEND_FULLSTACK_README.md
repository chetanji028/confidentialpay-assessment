# Backend & Full-Stack Skill Tests

## For Candidates: Which Test is for You?

### Option 1: Backend Developer Task (1-1.5 hours)
**If you're applying for:** Backend, API, or server-side roles

- Implement one API endpoint with input validation
- Simple filtering by transaction type
- Focus on backend logic and error handling
- No frontend work required
- **File:** `BACKEND_SKILL_TEST.md`

### Option 2: Full-Stack Developer Task (1-1.5 hours)
**If you're applying for:** Full-stack or platform engineer roles

- Build the same backend endpoint
- Add frontend integration and simple UI
- Shows end-to-end thinking (quick version)
- **File:** `FULLSTACK_SKILL_TEST.md`

---

## How to Get Started

### Step 1: Read the Right Test
- Backend developers: Read `BACKEND_SKILL_TEST.md`
- Full-stack developers: Read `FULLSTACK_SKILL_TEST.md`

### Step 2: Reference Guide (While Working)
- Use `BACKEND_REFERENCE_GUIDE.md` for:
  - Code patterns and examples
  - JavaScript/Node cheat sheet
  - Common gotchas
  - Testing instructions

### Step 3: Implement
- Follow the step-by-step guidance in your task
- Build incrementally
- Test as you go

### Step 4: Verify & Document
- Test your implementation thoroughly
- Document test cases and results
- Write a brief explanation note

---

## Deliverables Checklist

### Backend Task
- [ ] Modified `backend/controllers/treasuryController.js`
- [ ] Modified `backend/routes/index.js`
- [ ] Test results (3 example API calls with responses)
- [ ] Brief explanation note (2-3 sentences)

### Full-Stack Task
- [ ] All Backend deliverables (above)
- [ ] Modified `src/pages/TreasuryPage.tsx` (filter dropdown + integration)
- [ ] Brief explanation note (2-3 sentences)

---

## What We're Looking For

✓ **Working Implementation** - Code that runs and works  
✓ **Input Validation** - Proper error handling  
✓ **Clean Code** - Readable, consistent with project style  
✓ **Testing** - Evidence you verified your work  
✓ **Integration** - (Full-stack only) Backend/frontend connect properly  

❌ **Red Flags:**
- No input validation
- Silently ignoring invalid input
- No testing evidence
- Broken functionality

---

## Timeline

### Backend Task (1-1.5 hours)

| Task | Time |
|------|------|
| Review project & data | 10 min |
| Implement endpoint | 20 min |
| Test thoroughly | 20 min |
| Document results | 10 min |

### Full-Stack Task (1-1.5 hours)

| Task | Time |
|------|------|
| Backend implementation | 40 min |
| Frontend integration | 30 min |
| Test end-to-end | 15 min |

---

## Project Context

ConFiPay is a privacy-first payroll and treasury platform:

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **Data**: Currently mock data
- **Focus**: Transaction filtering

Your implementation extends the existing treasury API.

---

## Files You'll Work With

**Backend Task:**
- `backend/controllers/treasuryController.js` ← Add your function
- `backend/routes/index.js` ← Register your route
- `backend/models/mockData.js` ← Reference (don't modify)

**Full-Stack Task:** (All above, plus:)
- `src/pages/TreasuryPage.tsx` ← Add filter UI

---

## Before You Submit

1. ✅ Code runs without errors
2. ✅ Input is validated
3. ✅ Filtering works correctly
4. ✅ Error handling works
5. ✅ (Full-stack) Frontend integrates cleanly
6. ✅ Test cases documented
7. ✅ Brief explanation written

---

## Good Luck!

This is a realistic technical assessment. We're looking for pragmatic solutions and clean code. Show your thinking, test your work, and communicate clearly through your implementation.

**Questions?** Refer to `BACKEND_REFERENCE_GUIDE.md` first.

Ready to start? Pick your task and go! 🚀
