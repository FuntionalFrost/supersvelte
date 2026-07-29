// src/lib/realtime.svelte.ts
import { toast } from 'svelte-sonner';

export interface RealtimeEvent {
	type: string;
	payload: Record<string, unknown>;
	timestamp: string;
}

export class RealtimeStream {
	events = $state<RealtimeEvent[]>([]);
	status = $state<'connecting' | 'connected' | 'disconnected'>('connecting');
	lastHeartbeat = $state<string | null>(null);

	constructor(endpoint = '/api/realtime') {
		$effect(() => {
			const eventSource = new EventSource(endpoint);

			eventSource.onopen = () => (this.status = 'connected');
			eventSource.onerror = () => (this.status = 'disconnected');

			eventSource.addEventListener('heartbeat', (e) => {
				const data = JSON.parse(e.data);
				this.lastHeartbeat = data.timestamp;
			});

			eventSource.addEventListener('app-event', (e) => {
				const data: RealtimeEvent = JSON.parse(e.data);
				this.events = [data, ...this.events];

				if (data.type === 'PROJECT_CREATED') toast.success('⚡ Realtime: Project created!');
				if (data.type === 'FILE_UPLOADED') toast.info('⚡ Realtime: New file uploaded!');
			});

			return () => eventSource.close();
		});
	}
}
