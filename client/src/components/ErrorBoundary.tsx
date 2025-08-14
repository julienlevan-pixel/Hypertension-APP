import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message?: string };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(err: any): State {
    return { hasError: true, message: err?.message || String(err) };
  }

  componentDidCatch(err: any, info: any) {
    console.error("UI Error:", err, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Oups, une erreur est survenue</h2>
          <p className="text-gray-600 mb-4">{this.state.message}</p>
          <p className="text-sm text-gray-500">Réessayez depuis le menu principal.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
