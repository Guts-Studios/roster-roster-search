# Warcrow Army Builder - Implementation Patterns

## Code Organization Patterns

### Component Structure
```typescript
// Standard component pattern used throughout the project
interface ComponentProps {
  // Props with clear TypeScript interfaces
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hooks at the top
  const { data, loading } = useCustomHook();
  
  // Event handlers
  const handleAction = () => {
    // Implementation
  };
  
  // Render with clear JSX structure
  return (
    <div className="tailwind-classes">
      {/* Content */}
    </div>
  );
};
```

### Hook Patterns
```typescript
// Custom hooks follow consistent patterns
export const useCustomHook = () => {
  const [state, setState] = useState<Type>(initialValue);
  
  // Effects and logic
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Return object with clear interface
  return {
    data: state,
    loading,
    actions: { setState }
  };
};
```

## Layout Patterns

### UnitCard Action Bar Pattern
```typescript
// Successful pattern for centering buttons with side controls
<div className="relative flex justify-center items-center px-3 py-2 border-t border-gray-600">
  {/* Centered main action */}
  <button className="w-24 h-8 flex items-center justify-center">
    <span className="text-center leading-none">
      {buttonText}
    </span>
  </button>
  
  {/* Side controls positioned absolutely */}
  <div className="absolute right-3">
    <SideControls />
  </div>
</div>
```

### Responsive Grid Pattern
```typescript
// Standard responsive grid for unit cards
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {units.map(unit => (
    <UnitCard key={unit.id} unit={unit} />
  ))}
</div>
```

## State Management Patterns

### Army List State
```typescript
// Centralized state management for army lists
const useArmyList = () => {
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  
  const addUnit = (unit: Unit) => {
    // Add unit logic with validation
  };
  
  const removeUnit = (unitId: string) => {
    // Remove unit logic
  };
  
  return { selectedUnits, totalPoints, addUnit, removeUnit };
};
```

### Authentication State
```typescript
// Authentication state with Supabase integration
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Supabase auth integration
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  return { user, loading, signIn, signOut };
};
```

## Data Fetching Patterns

### CSV Data Processing
```typescript
// Pattern for processing CSV data into typed objects
const processUnitData = (csvData: string[][]): Unit[] => {
  return csvData.map(row => ({
    id: row[0],
    name: row[1],
    points: parseInt(row[2]),
    tournamentLegal: row[3] === 'true',
    // ... other fields
  }));
};
```

### Caching Pattern
```typescript
// Version-controlled caching with invalidation
const useCachedData = <T>(key: string, fetcher: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const cachedData = getCachedData(key);
    if (cachedData && !isCacheExpired(key)) {
      setData(cachedData);
      setLoading(false);
    } else {
      fetcher().then(freshData => {
        setCachedData(key, freshData);
        setData(freshData);
        setLoading(false);
      });
    }
  }, [key]);
  
  return { data, loading };
};
```

## Error Handling Patterns

### Component Error Boundaries
```typescript
// Error boundary pattern for component isolation
class ComponentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Component error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    
    return this.props.children;
  }
}
```

### Async Error Handling
```typescript
// Consistent async error handling
const handleAsyncAction = async () => {
  try {
    setLoading(true);
    const result = await asyncOperation();
    setData(result);
  } catch (error) {
    console.error('Operation failed:', error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

## Testing Patterns

### Component Testing
```typescript
// Standard component test pattern
describe('UnitCard', () => {
  const mockUnit = {
    id: '1',
    name: 'Test Unit',
    points: 15,
    // ... other properties
  };
  
  it('renders unit information correctly', () => {
    render(<UnitCard unit={mockUnit} />);
    expect(screen.getByText('Test Unit')).toBeInTheDocument();
    expect(screen.getByText('15 PTS')).toBeInTheDocument();
  });
  
  it('centers View Card button', () => {
    render(<UnitCard unit={mockUnit} />);
    const button = screen.getByText('View Card');
    expect(button).toHaveClass('flex', 'items-center', 'justify-center');
  });
});
```

## Performance Patterns

### Memoization
```typescript
// Memoization for expensive calculations
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return expensiveProcessing(data);
  }, [data]);
  
  return <div>{processedData}</div>;
});
```

### Lazy Loading
```typescript
// Lazy loading for code splitting
const LazyComponent = React.lazy(() => import('./LazyComponent'));

const App = () => (
  <Suspense fallback={<Loading />}>
    <LazyComponent />
  </Suspense>
);