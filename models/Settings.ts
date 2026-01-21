import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettings extends Document {
  _id: string;

  // Commission Settings
  commissionRate: number; // Pourcentage de commission (ex: 10 pour 10%)

  // General Store Settings
  storeName: {
    fr: string;
    en: string;
    es: string;
  };
  storeDescription: {
    fr: string;
    en: string;
    es: string;
  };
  storeLogo?: string;
  storeFavicon?: string;
  contactEmail: string;
  contactPhone: string;
  supportEmail: string;

  // Address
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };

  // Social Media
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };

  // Currency & Localization
  defaultCurrency: string;
  currencySymbol: string;
  currencyPosition: 'before' | 'after';
  defaultLanguage: 'fr' | 'en' | 'es';

  // Tax Settings
  taxEnabled: boolean;
  taxRate: number;
  taxLabel: {
    fr: string;
    en: string;
    es: string;
  };
  pricesIncludeTax: boolean;

  // Shipping Settings
  freeShippingThreshold: number;
  freeShippingEnabled: boolean;

  // Payment Settings
  paymentMethods: {
    stripe: {
      enabled: boolean;
      publicKey?: string;
      secretKey?: string;
    };
    paypal: {
      enabled: boolean;
      clientId?: string;
      secretKey?: string;
    };
    cashOnDelivery: {
      enabled: boolean;
    };
    bankTransfer: {
      enabled: boolean;
      bankName?: string;
      accountNumber?: string;
      accountName?: string;
    };
  };

  // Email Settings
  emailNotifications: {
    orderConfirmation: boolean;
    orderShipped: boolean;
    orderDelivered: boolean;
    orderCancelled: boolean;
    newUserWelcome: boolean;
    passwordReset: boolean;
  };

  // Store Policies
  policies: {
    termsAndConditions: {
      fr: string;
      en: string;
      es: string;
    };
    privacyPolicy: {
      fr: string;
      en: string;
      es: string;
    };
    returnPolicy: {
      fr: string;
      en: string;
      es: string;
    };
    shippingPolicy: {
      fr: string;
      en: string;
      es: string;
    };
  };

  // SEO Settings
  seo: {
    metaTitle: {
      fr: string;
      en: string;
      es: string;
    };
    metaDescription: {
      fr: string;
      en: string;
      es: string;
    };
    metaKeywords: {
      fr: string;
      en: string;
      es: string;
    };
    ogImage?: string;
  };

  // Order Settings
  orderSettings: {
    orderPrefix: string;
    minimumOrderAmount: number;
    allowGuestCheckout: boolean;
  };

  // Maintenance Mode
  maintenanceMode: boolean;
  maintenanceMessage: {
    fr: string;
    en: string;
    es: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    commissionRate: {
      type: Number,
      required: true,
      default: 10,
      min: [0, 'Commission rate cannot be negative'],
      max: [100, 'Commission rate cannot exceed 100%'],
    },
    storeName: {
      fr: { type: String, default: 'Nature Pharmacy' },
      en: { type: String, default: 'Nature Pharmacy' },
      es: { type: String, default: 'Nature Pharmacy' },
    },
    storeDescription: {
      fr: { type: String, default: 'Votre marketplace de produits naturels' },
      en: { type: String, default: 'Your natural products marketplace' },
      es: { type: String, default: 'Tu mercado de productos naturales' },
    },
    storeLogo: String,
    storeFavicon: String,
    contactEmail: {
      type: String,
      required: true,
      default: 'contact@naturepharmacy.com',
    },
    contactPhone: {
      type: String,
      default: '+221 00 000 00 00',
    },
    supportEmail: {
      type: String,
      default: 'support@naturepharmacy.com',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      postalCode: { type: String, default: '' },
    },
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
      youtube: String,
    },
    defaultCurrency: {
      type: String,
      default: 'XOF',
    },
    currencySymbol: {
      type: String,
      default: 'CFA',
    },
    currencyPosition: {
      type: String,
      enum: ['before', 'after'],
      default: 'after',
    },
    defaultLanguage: {
      type: String,
      enum: ['fr', 'en', 'es'],
      default: 'fr',
    },
    taxEnabled: {
      type: Boolean,
      default: true,
    },
    taxRate: {
      type: Number,
      default: 18,
      min: 0,
      max: 100,
    },
    taxLabel: {
      fr: { type: String, default: 'TVA' },
      en: { type: String, default: 'VAT' },
      es: { type: String, default: 'IVA' },
    },
    pricesIncludeTax: {
      type: Boolean,
      default: true,
    },
    freeShippingThreshold: {
      type: Number,
      default: 50000,
    },
    freeShippingEnabled: {
      type: Boolean,
      default: true,
    },
    paymentMethods: {
      stripe: {
        enabled: { type: Boolean, default: false },
        publicKey: String,
        secretKey: String,
      },
      paypal: {
        enabled: { type: Boolean, default: false },
        clientId: String,
        secretKey: String,
      },
      cashOnDelivery: {
        enabled: { type: Boolean, default: true },
      },
      bankTransfer: {
        enabled: { type: Boolean, default: false },
        bankName: String,
        accountNumber: String,
        accountName: String,
      },
    },
    emailNotifications: {
      orderConfirmation: { type: Boolean, default: true },
      orderShipped: { type: Boolean, default: true },
      orderDelivered: { type: Boolean, default: true },
      orderCancelled: { type: Boolean, default: true },
      newUserWelcome: { type: Boolean, default: true },
      passwordReset: { type: Boolean, default: true },
    },
    policies: {
      termsAndConditions: {
        fr: { type: String, default: '' },
        en: { type: String, default: '' },
        es: { type: String, default: '' },
      },
      privacyPolicy: {
        fr: { type: String, default: '' },
        en: { type: String, default: '' },
        es: { type: String, default: '' },
      },
      returnPolicy: {
        fr: { type: String, default: '' },
        en: { type: String, default: '' },
        es: { type: String, default: '' },
      },
      shippingPolicy: {
        fr: { type: String, default: '' },
        en: { type: String, default: '' },
        es: { type: String, default: '' },
      },
    },
    seo: {
      metaTitle: {
        fr: { type: String, default: 'Nature Pharmacy - Produits naturels' },
        en: { type: String, default: 'Nature Pharmacy - Natural products' },
        es: { type: String, default: 'Nature Pharmacy - Productos naturales' },
      },
      metaDescription: {
        fr: { type: String, default: 'Découvrez nos produits naturels' },
        en: { type: String, default: 'Discover our natural products' },
        es: { type: String, default: 'Descubre nuestros productos naturales' },
      },
      metaKeywords: {
        fr: { type: String, default: 'produits naturels, herbes, cosmétiques' },
        en: { type: String, default: 'natural products, herbs, cosmetics' },
        es: { type: String, default: 'productos naturales, hierbas, cosméticos' },
      },
      ogImage: String,
    },
    orderSettings: {
      orderPrefix: { type: String, default: 'NP' },
      minimumOrderAmount: { type: Number, default: 0 },
      allowGuestCheckout: { type: Boolean, default: false },
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    maintenanceMessage: {
      fr: { type: String, default: 'Site en maintenance, nous revenons bientôt' },
      en: { type: String, default: 'Site under maintenance, we will be back soon' },
      es: { type: String, default: 'Sitio en mantenimiento, volveremos pronto' },
    },
  },
  {
    timestamps: true,
  }
);

const Settings: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
