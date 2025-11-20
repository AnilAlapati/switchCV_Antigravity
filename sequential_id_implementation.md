# Sequential ID Assignment System - Design Document

## Overview
Implement a scalable, distributed ID assignment system that assigns sequential IDs (1-99999999) to resumes, then switches to alphanumeric IDs when numeric IDs are exhausted. Must handle millions of concurrent users.

## Requirements
- ✅ Start from ID 1
- ✅ Go up to 8 digits (99,999,999)
- ✅ Switch to alphanumeric when numeric IDs exhausted
- ✅ First-come-first-serve basis
- ✅ Handle millions of concurrent users
- ✅ No duplicate IDs
- ✅ High availability and fault tolerance

## Architecture Design

### Option 1: Distributed Sharded Counter (RECOMMENDED) ⭐
**Pros:**
- High throughput (can handle 500+ writes/second per shard)
- Scalable to millions of requests
- Built on Firestore's native capabilities
- No external dependencies

**Cons:**
- Slightly more complex implementation
- IDs may not be perfectly sequential under extreme load

### Option 2: Single Counter with Transactions
**Pros:**
- Simple implementation
- Guaranteed sequential IDs

**Cons:**
- Limited to ~500 writes/second (Firestore transaction limit on single document)
- Bottleneck for millions of concurrent users

### Option 3: Cloud Tasks Queue + Counter
**Pros:**
- Perfect sequencing
- Handles bursts well

**Cons:**
- Additional cost for Cloud Tasks
- More infrastructure complexity

## Selected Approach: Distributed Sharded Counter + ID Reservation

### System Components

#### 1. **ID Counter Collection** (`id_counters`)
```typescript
{
  "resume_counter": {
    "shards": {
      "0": { "count": 1250 },
      "1": { "count": 1189 },
      "2": { "count": 1301 },
      // ... up to N shards
    },
    "numericExhausted": false,
    "totalAssigned": 3740,
    "maxNumeric": 99999999
  }
}
```

#### 2. **ID Reservation System**
- Pre-allocate ID ranges to reduce contention
- Each request reserves a small batch (e.g., 10-100 IDs)
- Distribute from the reserved pool

#### 3. **Fallback to Alphanumeric**
When numeric IDs reach 99,999,999:
- Switch to base-62 encoding (a-z, A-Z, 0-9)
- Start with 6-character IDs (56.8 billion combinations)
- Pattern: `aaaaaa` → `aaaaab` → ... → `ZZZZZZ`

## Implementation Plan

### Phase 1: Core Infrastructure

#### [CREATE] `/src/lib/idGenerator.ts`
- Distributed counter with sharding
- ID reservation logic
- Alphanumeric ID generation
- Collision detection & retry logic

#### [CREATE] `/src/app/api/reserve-id/route.ts`
- Next.js API route to reserve IDs
- Rate limiting considerations
- Error handling

#### [MODIFY] `/src/components/features/ChatInterface.tsx`
- Call ID reservation API before saving resume
- Use reserved ID as document ID
- Handle reservation failures gracefully

#### [MODIFY] `/firestore.rules`
- Add rules for `id_counters` collection
- Ensure only server can write to counters
- Allow resume creation with custom IDs

### Phase 2: Initialization

#### [CREATE] `/scripts/initialize-counters.ts`
- Script to initialize counter shards
- Set up initial configuration
- Can be run via npm script

### Phase 3: Monitoring & Observability

#### [CREATE] `/src/lib/idMetrics.ts`
- Track ID assignment metrics
- Alert when approaching numeric limit
- Monitor shard distribution

## Technical Implementation Details

### Sharding Strategy
- **Number of Shards**: 50 (configurable)
- **Shard Selection**: Random or round-robin
- **Throughput**: ~25,000 writes/second theoretical max (500/shard * 50)

### ID Format Transition
```
Numeric:     1 → 99999999 (99.9M IDs)
Alphanumeric: aaaaaa → ZZZZZZ (56.8B combinations)
```

### Concurrency Handling
1. **Optimistic Transaction**: Try to increment counter
2. **Retry Logic**: Exponential backoff if contention detected
3. **Fallback Shards**: If one shard is hot, use another

### Data Structure: Resumes Collection
```typescript
{
  "1": {  // Document ID is the assigned number
    "resumeData": {...},
    "createdAt": Timestamp,
    "userId": "optional-user-id"
  },
  "2": {...},
  "aaaaaa": {...}  // Alphanumeric IDs when numeric exhausted
}
```

## Performance Metrics

### Expected Performance
- **Sequential IDs/second**: 20,000+
- **Concurrent requests**: Millions (limited by infrastructure, not algorithm)
- **Latency per ID**: 50-200ms
- **Collision rate**: < 0.001%

### Scalability
- **99.9M numeric IDs**: Sufficient for initial growth
- **56.8B alphanumeric IDs**: Virtually unlimited
- **Shard scaling**: Can increase shards dynamically

## Migration Path

### From Current System
1. Get max existing Firestore document ID (if any numeric IDs exist)
2. Initialize counter to max + 1
3. New resumes use sequential system
4. Old resumes remain unchanged (backward compatible)

## Monitoring & Alerts

### Key Metrics to Track
- Total IDs assigned
- IDs remaining in numeric pool
- Shard distribution (detect hot shards)
- Assignment latency
- Collision/retry rate

### Alerts
- When 90% of numeric IDs consumed
- When 95% of numeric IDs consumed
- If collision rate > 1%
- If assignment latency > 1s

## Rollback Strategy
If issues arise:
1. Pause new ID assignments
2. Fall back to Firestore auto-generated IDs temporarily
3. Fix issues in ID generator
4. Resume sequential assignment from last known good state

## Security Considerations
- Only server-side code can increment counters (enforced via Firestore rules)
- Rate limiting on ID reservation API
- Prevent ID enumeration attacks with proper access controls

## Cost Analysis
- **Firestore Reads**: ~1 read per ID assignment (check shard)
- **Firestore Writes**: ~1 write per ID assignment (increment shard)
- **Expected Monthly Cost** (1M resumes/month): ~$0.54 (reads) + $0.54 (writes) = $1.08

## Future Enhancements
- Custom ID prefixes for different resume types
- Vanity IDs (user can claim specific IDs)
- ID recycling (reclaim deleted resume IDs)
- Geographic sharding (assign IDs based on region)
