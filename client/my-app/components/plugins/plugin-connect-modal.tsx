"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Plugin } from "@/lib/types";
import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast";

interface PluginConnectModalProps {
  plugin: Plugin | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PluginConnectModal({ plugin, isOpen, onClose }: PluginConnectModalProps) {
  const toast = useToast();
  const { connectPlugin, disconnectPlugin, user } = useAppStore();
  const [isConnecting, setIsConnecting] = useState(false);

  if (!plugin || !isOpen) return null;

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      connectPlugin(plugin.id, user.email);
      setIsConnecting(false);
      toast.success(`${plugin.name} integration connected!`);
      onClose();
    }, 900);
  };

  const handleDisconnect = () => {
    disconnectPlugin(plugin.id);
    toast.info(`${plugin.name} disconnected`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
            <Icon icon={plugin.icon} size={20} />
          </div>
          <span>{plugin.connected ? `Manage ${plugin.name}` : `Connect ${plugin.name}`}</span>
        </div>
      }
    >
      <div className="space-y-4 pt-1 text-xs">
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          {plugin.description}
        </p>

        {plugin.connected ? (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
              <Icon icon="solar:check-circle-bold" size={16} />
              <span>Status: Authorized and Active</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              Connected Account: <strong className="text-slate-800 dark:text-slate-200">{plugin.accountEmail || user.email}</strong>
            </p>
            {plugin.lastSynced && (
              <p className="text-slate-400">
                Last synchronized: {plugin.lastSynced}
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4 space-y-3">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">
              This integration allows the AI workspace to:
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              {plugin.permissions.map((perm, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Icon icon="solar:check-read-bold" size={14} className="text-emerald-500 shrink-0" />
                  <span>{perm}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-xl bg-blue-50/50 dark:bg-blue-950/20 p-3 border border-blue-200/40 dark:border-blue-900/40 flex items-start gap-2">
          <Icon icon="solar:shield-check-bold" size={16} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
            Enterprise grade OAuth 2.0 authorization. Tokens are encrypted and never exposed in client payloads.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>

          {plugin.connected ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDisconnect}
              leftIcon="solar:trash-bin-trash-line-duotone"
            >
              Disconnect
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              isLoading={isConnecting}
              onClick={handleConnect}
              leftIcon="solar:plug-circle-bold"
            >
              Authorize & Connect
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
