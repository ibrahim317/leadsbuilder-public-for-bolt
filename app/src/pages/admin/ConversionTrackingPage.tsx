import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { toast } from 'react-hot-toast';
import { supabaseClient } from '../../lib/supabaseClient';

interface TrackingConfig {
  facebook_pixel_id: string;
  tiktok_pixel_id: string;
  google_analytics_id: string;
}

export default function ConversionTrackingPage() {
  const [config, setConfig] = useState<TrackingConfig>({
    facebook_pixel_id: '',
    tiktok_pixel_id: '',
    google_analytics_id: ''
  });

  useEffect(() => {
    loadTrackingConfig();
  }, []);

  const loadTrackingConfig = async () => {
    const { data, error } = await supabaseClient
      .from('tracking_config')
      .select('*')
      .single();

    if (error) {
      toast.error('Erreur lors du chargement de la configuration');
      return;
    }

    if (data) {
      setConfig(data);
    }
  };

  const saveConfig = async () => {
    const { error } = await supabaseClient
      .from('tracking_config')
      .upsert({
        id: 1, // Using a single row for config
        ...config,
        updated_at: new Date().toISOString()
      });

    if (error) {
      toast.error('Erreur lors de la sauvegarde');
      return;
    }

    toast.success('Configuration sauvegardée');
    updateTrackingScripts();
  };

  const updateTrackingScripts = () => {
    // Facebook Pixel
    if (config.facebook_pixel_id) {
      const fbScript = document.createElement('script');
      fbScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${config.facebook_pixel_id}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(fbScript);
    }

    // TikTok Pixel
    if (config.tiktok_pixel_id) {
      const ttScript = document.createElement('script');
      ttScript.innerHTML = `
        !function (w, d, t) {
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
          ttq.load('${config.tiktok_pixel_id}');
          ttq.page();
        }(window, document, 'ttq');
      `;
      document.head.appendChild(ttScript);
    }

    // Google Analytics
    if (config.google_analytics_id) {
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${config.google_analytics_id}`;
      document.head.appendChild(gaScript);

      const gaConfigScript = document.createElement('script');
      gaConfigScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${config.google_analytics_id}');
      `;
      document.head.appendChild(gaConfigScript);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Configuration du Tracking</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Facebook Pixel ID
          </label>
          <Input
            value={config.facebook_pixel_id}
            onChange={(e) => setConfig({ ...config, facebook_pixel_id: e.target.value })}
            placeholder="Entrez votre Facebook Pixel ID"
            className="max-w-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            TikTok Pixel ID
          </label>
          <Input
            value={config.tiktok_pixel_id}
            onChange={(e) => setConfig({ ...config, tiktok_pixel_id: e.target.value })}
            placeholder="Entrez votre TikTok Pixel ID"
            className="max-w-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Google Analytics ID (GA4)
          </label>
          <Input
            value={config.google_analytics_id}
            onChange={(e) => setConfig({ ...config, google_analytics_id: e.target.value })}
            placeholder="Entrez votre Google Analytics ID"
            className="max-w-md"
          />
        </div>

        <Button onClick={saveConfig} className="mt-4">
          Sauvegarder la configuration
        </Button>
      </div>
    </div>
  );
}
