import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error(`Error loading localStorage key "${key}":`, error);
			return initialValue;
		}
	});

	useEffect(() => {
		try {
			window.localStorage.setItem(key, JSON.stringify(storedValue));
		} catch (error) {
			console.error(`Error saving localStorage key "${key}":`, error);
		}
	}, [key, storedValue]);

	const removeValue = () => {
		try {
			window.localStorage.removeItem(key);
			setStoredValue(initialValue);
		} catch (error) {
			console.error(`Error removing localStorage key "${key}":`, error);
		}
	};

	return [storedValue, setStoredValue, removeValue] as const;
}
