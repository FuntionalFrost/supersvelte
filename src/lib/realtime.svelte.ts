// src/lib/realtime.svelte.ts
export interface HeartbeatPayload {
	timestamp: string;
	pingCount: number;
}

export class RealtimeStream {
	// Reactive Svelte 5 state
	status = $state<'connecting' | 'connected' | 'error'>('connecting');
	lastPayload = $state<HeartbeatPayload | null>(null);
	history = $state<HeartbeatPayload[]>([]);

	private eventSource: EventSource | null = null;

	constructor(endpoint: string = '/api/realtime') {
		if (typeof window !== 'undefined') {
			this.connect(endpoint);
		}
	}

	private connect(endpoint: string) {
		this.eventSource = new EventSource(endpoint);

		this.eventSource.onopen = () => {
			this.status = 'connected';
		};

		// Listen for named SSE event 'heartbeat'
		this.eventSource.addEventListener('heartbeat', (event) => {
			try {
				const data: HeartbeatPayload = JSON.parse(event.data);
				this.lastPayload = data;
				this.history = [data, ...this.history.slice(0, 9)]; // Keep last 10
			} catch (err) {
				console.error('Failed to parse SSE payload:', err);
			}
		});

		this.eventSource.onerror = () => {
			this.status = 'error';
		};
	}

	close() {
		this.eventSource?.close();
		this.status = 'error';
	}
}
