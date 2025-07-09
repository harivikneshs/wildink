interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
}

class LocalStorageClientClass {
  private readonly CHECKOUT_FORM_KEY = "wildink_checkout_form";

  /**
   * Check if localStorage is available (for SSR compatibility)
   */
  private isLocalStorageAvailable(): boolean {
    try {
      return typeof window !== "undefined" && window.localStorage !== null;
    } catch {
      return false;
    }
  }

  /**
   * Save checkout form data to localStorage
   */
  saveCheckoutDetails(formData: CheckoutFormData): void {
    if (!this.isLocalStorageAvailable()) {
      console.warn("localStorage is not available");
      return;
    }

    try {
      const dataToStore = {
        ...formData,
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem(this.CHECKOUT_FORM_KEY, JSON.stringify(dataToStore));
      console.log("✅ Checkout form data saved to localStorage");
    } catch (error) {
      console.error("❌ Error saving checkout form data:", error);
    }
  }

  /**
   * Retrieve checkout form data from localStorage
   */
  getCheckoutDetails(): CheckoutFormData | null {
    if (!this.isLocalStorageAvailable()) {
      console.warn("localStorage is not available");
      return null;
    }

    try {
      const stored = localStorage.getItem(this.CHECKOUT_FORM_KEY);
      if (!stored) {
        return null;
      }

      const parsed = JSON.parse(stored);

      // Return only the form fields, excluding metadata
      return {
        name: parsed.name || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
        address: parsed.address || "",
        pincode: parsed.pincode || "",
      };
    } catch (error) {
      console.error("❌ Error retrieving checkout form data:", error);
      return null;
    }
  }

  /**
   * Clear checkout form data from localStorage
   */
  clearCheckoutDetails(): void {
    if (!this.isLocalStorageAvailable()) {
      console.warn("localStorage is not available");
      return;
    }

    try {
      localStorage.removeItem(this.CHECKOUT_FORM_KEY);
      console.log("✅ Checkout form data cleared from localStorage");
    } catch (error) {
      console.error("❌ Error clearing checkout form data:", error);
    }
  }

  /**
   * Check if checkout form data exists in localStorage
   */
  hasCheckoutDetails(): boolean {
    if (!this.isLocalStorageAvailable()) {
      return false;
    }

    try {
      const stored = localStorage.getItem(this.CHECKOUT_FORM_KEY);
      return stored !== null;
    } catch (error) {
      console.error("❌ Error checking checkout form data:", error);
      return false;
    }
  }
}

// Export singleton instance
export const LocalStorageClient = new LocalStorageClientClass();

// Export types
export type { CheckoutFormData };
