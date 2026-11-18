'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  BusinessCategoryId,
  BusinessCategory,
  BUSINESS_CATEGORIES,
  ERP_MODULES,
  ERPModule,
  STORAGE_KEY_CATEGORY,
  STORAGE_KEY_CUSTOM_MODULES,
  getInitialCategory,
} from '@/lib/businessModules';

interface ERPContextType {
  activeCategoryId: BusinessCategoryId;
  activeCategory: BusinessCategory;
  selectCategory: (categoryId: BusinessCategoryId) => void;
  visibleModules: ERPModule[];
  allModules: ERPModule[];
  activeModuleIds: string[];
  isModuleActive: (moduleId: string) => boolean;
  toggleModule: (moduleId: string) => void;
  resetToCategoryDefaults: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  dismissToast: () => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export function ERPProvider({ children }: { children: React.ReactNode }) {
  const [activeCategoryId, setActiveCategoryId] = useState<BusinessCategoryId>(() => {
    if (typeof window === 'undefined') return 'services';
    return getInitialCategory();
  });
  const targetCategory = BUSINESS_CATEGORIES.find(c => c.id === activeCategoryId) || BUSINESS_CATEGORIES[0];

  const [activeModuleIds, setActiveModuleIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return targetCategory.allowedModuleIds;
    const savedOverrides = localStorage.getItem(STORAGE_KEY_CUSTOM_MODULES);
    if (savedOverrides) {
      try {
        const parsed = JSON.parse(savedOverrides);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing custom modules override', e);
      }
    }
    return targetCategory.allowedModuleIds;
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  }, []);

  const dismissToast = useCallback(() => setToastMessage(null), []);

  const selectCategory = useCallback((categoryId: BusinessCategoryId) => {
    const found = BUSINESS_CATEGORIES.find(c => c.id === categoryId);
    if (!found) return;

    setActiveCategoryId(categoryId);
    setActiveModuleIds(found.allowedModuleIds);

    localStorage.setItem(STORAGE_KEY_CATEGORY, categoryId);
    localStorage.removeItem(STORAGE_KEY_CUSTOM_MODULES);

    showToast(`Switched to "${found.name}". ${found.allowedModuleIds.length} modules active.`);
  }, [showToast]);

  const toggleModule = useCallback((moduleId: string) => {
    if (moduleId === 'dashboard') {
      showToast('Dashboard is required and cannot be deactivated.');
      return;
    }

    const updated = activeModuleIds.includes(moduleId)
      ? activeModuleIds.filter(id => id !== moduleId)
      : [...activeModuleIds, moduleId];

    setActiveModuleIds(updated);
    localStorage.setItem(STORAGE_KEY_CUSTOM_MODULES, JSON.stringify(updated));

    const mod = ERP_MODULES.find(m => m.id === moduleId);
    const stateText = updated.includes(moduleId) ? 'activated' : 'deactivated';
    showToast(`Module "${mod?.label || moduleId}" ${stateText}.`);
  }, [activeModuleIds, showToast]);

  const resetToCategoryDefaults = useCallback(() => {
    const found = BUSINESS_CATEGORIES.find(c => c.id === activeCategoryId) || BUSINESS_CATEGORIES[0];
    setActiveModuleIds(found.allowedModuleIds);
    localStorage.removeItem(STORAGE_KEY_CUSTOM_MODULES);
    showToast(`Reset modules to ${found.name} defaults.`);
  }, [activeCategoryId, showToast]);

  const isModuleActive = useCallback((moduleId: string) => activeModuleIds.includes(moduleId), [activeModuleIds]);

  const activeCategory = BUSINESS_CATEGORIES.find(c => c.id === activeCategoryId) || BUSINESS_CATEGORIES[0];

  const visibleModules = ERP_MODULES.filter(m => activeModuleIds.includes(m.id));

  return (
    <ERPContext.Provider
      value={{
        activeCategoryId,
        activeCategory,
        selectCategory,
        visibleModules,
        allModules: ERP_MODULES,
        activeModuleIds,
        isModuleActive,
        toggleModule,
        resetToCategoryDefaults,
        toastMessage,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
}

export function useERP() {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
}
