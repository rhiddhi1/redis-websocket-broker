# Redis WebSocket Broker

A horizontally scalable real-time messaging system built with **WebSockets and Redis Pub/Sub**.

The project demonstrates how to move from a single WebSocket server to a distributed architecture capable of handling **multiple server instances, cross-instance messaging, connection management, backpressure, failure handling, and observability**.

## Architecture

```text
                         ┌──────────────┐
                         │    Clients   │
                         └──────┬───────┘
                                │ WebSocket
                                ▼
                         ┌──────────────┐
                         │Load Balancer │
                         └──────┬───────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
        ┌───────────┐     ┌───────────┐     ┌───────────┐
        │ WS Server │     │ WS Server │     │ WS Server │
        │     #1    │     │     #2    │     │     #3    │
        └─────┬─────┘     └─────┬─────┘     └─────┬─────┘
              │                 │                 │
              └─────────────────┼─────────────────┘
                                ▼
                         ┌──────────────┐
                         │Redis Pub/Sub │
                         └──────────────┘
```

Each server manages its own WebSocket connections while Redis provides **cross-instance message propagation**.

## Engineering Highlights

- **Horizontal scaling** — multiple WebSocket instances behind a load balancer
- **Distributed messaging** — Redis Pub/Sub synchronizes events across instances
- **Connection management** — lifecycle handling, heartbeats, cleanup, and graceful shutdown
- **Backpressure** — protection against slow consumers and unbounded memory growth
- **Failure handling** — Redis reconnects, client disconnects, and server failures
- **Rate limiting** — protects servers and Redis from excessive client traffic
- **Message validation** — validates payloads before publishing
- **Observability** — structured logs and metrics for connections, messages, latency, and errors
- **Load testing** — measures concurrent connections, throughput, p95/p99 latency, CPU, and memory

## Message Flow

```text
Client
  │
  │ WebSocket message
  ▼
WebSocket Server
  │
  ├── Authenticate
  ├── Validate
  ├── Authorize
  │
  ▼
Redis Pub/Sub
  │
  ├──────────► Server #1 ──► Clients
  ├──────────► Server #2 ──► Clients
  └──────────► Server #3 ──► Clients
```

This allows a client connected to Server #1 to communicate with clients connected to other instances.

## Delivery Model

Redis Pub/Sub provides **low-latency, ephemeral messaging**, but does not provide durable storage or message replay.

Therefore, this architecture is suitable for:

- Real-time notifications
- Presence
- Typing indicators
- Live dashboards
- Multiplayer state updates

For durable workloads requiring acknowledgements, replay, or guaranteed processing, the architecture can evolve toward **Redis Streams or Kafka**.

## Scaling Considerations

System capacity depends on more than connection count:

```text
Message Work
    =
Messages/sec
×
Average Fan-out
×
Message Size
```

The project therefore evaluates:

- Concurrent connections
- Messages/sec
- Fan-out
- p50 / p95 / p99 latency
- Memory usage
- CPU usage
- Redis throughput
- Slow consumers

## Failure & Reliability

The system considers:

- Redis disconnections and reconnection backoff
- WebSocket disconnects
- Dead connections through heartbeats
- Slow consumers
- Graceful server shutdown
- Connection cleanup
- Temporary Redis failures

## Tech Stack

- **Runtime:** Node.js
- **Protocol:** WebSocket
- **Broker:** Redis Pub/Sub
- **Testing:** Unit + integration + load testing
- **Observability:** Structured logging + metrics

## Running Locally

```bash
pnpm install
redis-server
pnpm dev
```

Run multiple instances to test horizontal scaling:

```bash
PORT=3000 pnpm dev
PORT=3001 pnpm dev
PORT=3002 pnpm dev
```

Then connect clients to different instances and observe messages propagating through Redis.

## Engineering Concepts

**WebSockets · Redis Pub/Sub · Distributed Systems · Horizontal Scaling · Load Balancing · Backpressure · Fan-out · Rate Limiting · Failure Handling · Observability · Load Testing · Latency Analysis · Delivery Semantics**

## Future Improvements

- Redis Streams / Kafka
- Durable message delivery
- Message replay
- Distributed tracing
- Prometheus + Grafana
- Chaos testing
- Kubernetes deployment
- Multi-region architecture
- Connection and room sharding
