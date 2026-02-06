import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { debounce } from '../debounce';

describe('debounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('calls the callback after the timeout', () => {
        const cb = vi.fn();
        const debounced = debounce(cb, 1000);

        debounced('a', 1);

        // not called immediately
        expect(cb).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1000);

        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith('a', 1);
    });

    it('resets timer on subsequent calls (calls only once)', () => {
        const cb = vi.fn();
        const debounced = debounce(cb, 200);

        debounced(1);
        vi.advanceTimersByTime(100);
        debounced(2);
        vi.advanceTimersByTime(100);

        // still not reached full 200ms since last call
        expect(cb).not.toHaveBeenCalled();

        vi.advanceTimersByTime(100);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith(2);
    });

    it('uses default timeout of 300ms', () => {
        const cb = vi.fn();
        const debounced = debounce(cb);

        debounced('test');
        vi.advanceTimersByTime(299);
        expect(cb).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith('test');
    });

    it('handles multiple arguments', () => {
        const cb = vi.fn();
        const debounced = debounce(cb, 100);

        debounced('arg1', 'arg2', { key: 'value' });
        vi.advanceTimersByTime(100);

        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith('arg1', 'arg2', { key: 'value' });
    });
});
