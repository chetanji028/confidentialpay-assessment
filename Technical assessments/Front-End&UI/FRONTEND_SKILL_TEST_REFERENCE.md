# Frontend Skill Test: Component Reference

**Quick guide to available UI components for your task**

---

## Available Components

### Button
```tsx
import { Button } from "@/components/ui/button";

// Variants: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
// Sizes: "default" | "sm" | "lg" | "icon"

<Button variant="default">Submit</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost" size="sm">Clear</Button>
<Button disabled>Disabled</Button>
```

**Variants:**
- `default` - Primary action (filled, blue)
- `outline` - Secondary action (border only)
- `secondary` - Alternative primary (gray)
- `ghost` - Minimal (hover background only)
- `link` - Text link with underline
- `destructive` - Danger action (red)

---

### Input
```tsx
import { Input } from "@/components/ui/input";

<Input 
  placeholder="Enter amount"
  type="number"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  aria-label="Withdrawal amount"
  disabled={isLoading}
/>
```

**Features:**
- Built-in focus states and transitions
- Supports all HTML input attributes
- Works with aria-label for accessibility

---

### Card / GlassCard
```tsx
import { GlassCard } from "@/components/layout/Primitives";

<GlassCard>
  <h3>Card Title</h3>
  <p>Card content</p>
</GlassCard>

// Add custom className for styling
<GlassCard className="border-2 border-primary">
  Custom styled card
</GlassCard>
```

**Features:**
- Frosted glass effect already applied
- Consistent padding/borders
- Works with className prop for customization

---

### Badge / ChainBadge
```tsx
import { ChainBadge } from "@/components/layout/Primitives";

<ChainBadge chain="BNB" />
<ChainBadge chain="ETH" />
```

---

### Tailwind Classes You Can Use

**Colors:**
- Text: `text-primary`, `text-muted-foreground`, `text-destructive`
- Background: `bg-input`, `bg-muted`, `bg-card`
- Border: `border-border`, `border-primary`

**Responsive:**
- Mobile-first: `sm:`, `md:`, `lg:`, `xl:` prefixes
- Example: `grid grid-cols-1 sm:grid-cols-2` (1 column on mobile, 2 on tablet+)

**Spacing:**
- Padding: `p-3`, `px-3`, `py-2` 
- Margin: `m-4`, `mb-3`, `mt-2`, `space-y-4`

**State styling:**
- Hover: `hover:bg-muted`, `hover:text-primary`
- Focus: `focus:border-primary`, `focus:ring-1`
- Disabled: `disabled:opacity-50`

**Visibility:**
- `opacity-50` for reduced visibility
- `hidden sm:block` to show only on tablet+

---

## Icons (lucide-react)

Available for use throughout the component:

```tsx
import { 
  Wallet, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Copy, 
  Loader,
  AlertCircle,
  CheckCircle,
  ChevronDown
} from "lucide-react";

<ArrowDownToLine className="h-4 w-4" />
<Loader className="h-4 w-4 animate-spin" /> {/* Loading spinner */}
```

---

## Form Patterns in This Codebase

### Labels (proper form structure)
```tsx
<div className="space-y-2">
  <label className="text-sm font-medium">Select Token</label>
  <select className="w-full rounded-lg border border-border bg-input/40 px-3 py-2">
    <option>USDC</option>
    <option>BNB</option>
  </select>
</div>
```

### Input with Helper Text
```tsx
<div className="space-y-2">
  <label className="text-sm font-medium">Amount</label>
  <Input 
    type="number" 
    placeholder="0.00"
    aria-label="Withdrawal amount"
  />
  <p className="text-xs text-muted-foreground">Max: 125,000 USDC</p>
</div>
```

### Form State Feedback
```tsx
{isLoading && (
  <div className="flex items-center gap-2 text-sm text-blue-500">
    <Loader className="h-4 w-4 animate-spin" />
    Processing...
  </div>
)}

{error && (
  <div className="flex items-center gap-2 rounded bg-destructive/10 p-3 text-sm text-destructive">
    <AlertCircle className="h-4 w-4" />
    {error}
  </div>
)}

{success && (
  <div className="flex items-center gap-2 rounded bg-green-500/10 p-3 text-sm text-green-600">
    <CheckCircle className="h-4 w-4" />
    Withdrawal submitted!
  </div>
)}
```

---

## Accessibility Hints

### Form Inputs
- Always pair inputs with visible `<label>` elements (not just placeholder)
- Add `aria-label` when label text isn't visible
- Use `aria-describedby` to link help text

```tsx
<label htmlFor="amount">Amount to withdraw</label>
<Input 
  id="amount"
  aria-describedby="amount-help"
  placeholder="0.00"
/>
<p id="amount-help" className="text-xs text-muted-foreground">
  Max: 125,000 USDC
</p>
```

### Buttons
- Button text should describe the action (not just "Submit")
- Use `aria-busy="true"` on button during loading
- Disabled buttons should have `disabled` attribute

```tsx
<Button 
  disabled={isLoading}
  aria-busy={isLoading}
>
  {isLoading ? "Processing..." : "Withdraw"}
</Button>
```

### Color Indicators
- Don't rely on color alone - use text + icon
- ✓ Good: `<CheckCircle /> Success`
- ✗ Bad: `<div className="text-green-500" />` (invisible to colorblind users)

---

## Common Patterns

### Loading State
```tsx
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    // API call
    toast.success("Done!");
  } finally {
    setIsLoading(false);
  }
};

<Button disabled={isLoading} onClick={handleSubmit}>
  {isLoading ? <Loader className="animate-spin" /> : "Submit"}
</Button>
```

### Conditional Content
```tsx
{amount > balance && (
  <p className="text-xs text-destructive">Amount exceeds balance</p>
)}

{!amount && (
  <p className="text-xs text-muted-foreground">Enter amount to continue</p>
)}
```

### Responsive Grid
```tsx
<div className="grid gap-4 sm:grid-cols-2">
  <div>Mobile: full width</div>
  <div>Tablet+: 2 columns</div>
</div>
```

---

**Remember:** Focus on one coherent improvement. Polish > breadth.
