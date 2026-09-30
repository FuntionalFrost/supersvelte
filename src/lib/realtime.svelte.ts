// src/lib/realtime.svelte.ts
import { toast } from 'yaxa-svelte';

export interface RealtimeEvent {
	type: string;
	payload: Record<string, unknown>;
	timestamp: string;
}

export class RealtimeStream {
	events = $state<RealtimeEvent[]>([]);
	status = $state<'connecting' | 'connected' | 'disconnected'>('disconnected');
	lastHeartbeat = $state<string | null>(null);

	private eventSource: EventSource | null = null;
	private endpoint: string;

	constructor(endpoint = '/api/realtime') {
		this.endpoint = endpoint;
	}

	connect() {
		if (typeof window === 'undefined' || this.eventSource) return;

		this.status = 'connecting';
		this.eventSource = new EventSource(this.endpoint);

		this.eventSource.onopen = () => {
			this.status = 'connected';
		};

		this.eventSource.onerror = () => {
			this.status = 'disconnected';
		};

		this.eventSource.addEventListener('heartbeat', (e) => {
			try {
				const data = JSON.parse(e.data);
				this.lastHeartbeat = data.timestamp;
			} catch {
				// Ignore malformed heartbeats
			}
		});

		this.eventSource.addEventListener('app-event', (e) => {
			try {
				const data: RealtimeEvent = JSON.parse(e.data);
				this.events = [data, ...this.events];

				if (data.type === 'PROJECT_CREATED') toast.success('⚡ Realtime: Project created!');
				if (data.type === 'FILE_UPLOADED') toast.info('⚡ Realtime: New file uploaded!');
			} catch {
				console.error('Failed to parse realtime event payload');
			}
		});
	}

	disconnect() {
		if (this.eventSource) {
			this.eventSource.close();
			this.eventSource = null;
			this.status = 'disconnected';
		}
	}
}
