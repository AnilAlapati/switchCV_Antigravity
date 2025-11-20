# Quick Reference: Sequential ID System

## First-Time Setup

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Initialize the ID Counter (One-Time Only)
```bash
curl -X POST http://localhost:3000/api/init-counters
```

**Expected Response:**
```json
{
  "success": true,
  "message": "ID counter system initialized successfully"
}
```

## How to Use

### For Developers

The system is **fully automatic**. When a user creates a resume:

1. User interacts with chat at `/dashboard/create`
2. System reserves next sequential ID automatically
3. Resume is saved with that ID
4. User is redirected to `/resumes/{id}`

**No manual intervention required!**

### API Endpoints

#### Reserve an ID
```bash
curl -X POST http://localhost:3000/api/reserve-id
```

Response:
```json
{
  "success": true,
  "id": "1",
  "message": "ID reserved successfully"
}
```

#### View Statistics
```bash
curl http://localhost:3000/api/reserve-id
```

Response:
```json
{
  "success": true,
  "statistics": {
    "totalAssigned": 150,
    "numericRemaining": 99999850,
    "numericExhausted": false,
    "shardDistribution": {...}
  }
}
```

## Testing

### Test Single ID Assignment
```bash
curl -X POST http://localhost:3000/api/reserve-id
```

### Test Rate Limiting
```bash
# Make 11 requests quickly
for i in {1..11}; do curl -X POST http://localhost:3000/api/reserve-id; done
```

Expected: First 10 succeed, 11th returns 429 error

### Test Resume Creation Flow
1. Navigate to http://localhost:3000/dashboard/create
2. Chat with the AI to create a resume
3. Verify you're redirected to `/resumes/1` (or next sequential number)
4. Check that the ID is displayed in the final message

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "ID counter not initialized" | Run: `curl -X POST http://localhost:3000/api/init-counters` |
| 429 Rate Limit Error | Wait 60 seconds and try again |
| Slow ID assignment | Check Firestore console for errors |
| Build errors | Run: `npm install` to ensure all deps installed |

## File Locations

### Core Files
- **ID Generator**: `src/lib/idGenerator.ts`
- **API Endpoints**: `src/app/api/reserve-id/route.ts`, `src/app/api/init-counters/route.ts`
- **Chat Interface**: `src/components/features/ChatInterface.tsx`

### Documentation
- **Full Guide**: `docs/ID_SYSTEM.md`
- **Architecture**: `sequential_id_implementation.md`
- **Summary**: `IMPLEMENTATION_SUMMARY.md`

## Key Configuration

Located in `src/lib/idGenerator.ts`:

```typescript
const NUM_SHARDS = 50;              // Number of distributed shards
const MAX_NUMERIC_ID = 99999999;    // 8-digit maximum
const MAX_RETRIES = 5;              // Transaction retry attempts
const ALPHANUMERIC_LENGTH = 6;      // Length of alphanumeric IDs
```

## Deployment Checklist

Before deploying to production:

- [ ] Run `npm run init-counters` or call init endpoint
- [ ] Deploy Firestore rules: `firebase deploy --only firestore:rules`
- [ ] Test ID reservation in production
- [ ] Set up monitoring for totalAssigned metric
- [ ] Configure alerts for when approaching 90% capacity
- [ ] Consider upgrading rate limiting to use Redis

## Monitoring

### Key Metrics to Watch
1. **totalAssigned**: Total IDs issued
2. **numericRemaining**: IDs left before alphanumeric
3. **avgLatency**: Average time to assign ID
4. **errorRate**: Failed assignments

### When to Act
- ⚠️ At 90M IDs (90%): Prepare for alphanumeric transition
- 🚨 At 95M IDs (95%): Test alphanumeric assignment
- ✅ At 99M+ IDs: System auto-switches to alphanumeric

## Support

For issues:
1. Check this Quick Reference
2. Review `docs/ID_SYSTEM.md` for detailed docs
3. Check Firestore console at https://console.firebase.google.com
4. Review application logs for errors

---

**System Status**: ✅ Ready for Production
**Current Version**: 1.0
**Last Updated**: 2025-11-20
