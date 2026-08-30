import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/PageHeader";
import TrustBadges from "@/components/TrustBadges";
import { useI18n } from "@/lib/i18n";
import { governmentOffices, officeTypes, distanceOptions } from "@/lib/officeData";
import { citizen } from "@/lib/indiaData";
import { cn } from "@/lib/utils";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Citizen's location (Anna Nagar, Chennai)
const CITIZEN_LOCATION = [13.0850, 80.2101];

function makeIcon(color) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });
}

const citizenIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="width:32px;height:32px;border-radius:50%;background:#0052CC;border:3px solid white;box-shadow:0 0 0 4px rgba(0,82,204,0.3),0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:14px;">📍</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function MapServices() {
  const { t, lang } = useI18n();
  const [selectedType, setSelectedType] = useState("All");
  const [maxDistance, setMaxDistance] = useState(0);
  const [selectedOffice, setSelectedOffice] = useState(null);

  const filteredOffices = useMemo(() => {
    return governmentOffices.filter((o) => {
      const typeMatch = selectedType === "All" || o.type === selectedType;
      const distanceMatch = maxDistance === 0 || o.distanceKm <= maxDistance;
      return typeMatch && distanceMatch;
    });
  }, [selectedType, maxDistance]);

  const typeCounts = useMemo(() => {
    const counts = {};
    governmentOffices.forEach((o) => {
      const withinDistance = maxDistance === 0 || o.distanceKm <= maxDistance;
      if (withinDistance) {
        counts[o.type] = (counts[o.type] || 0) + 1;
      }
    });
    return counts;
  }, [maxDistance]);

  return (
    <div>
      <PageHeader
        title={t("map.title")}
        subtitle={t("map.subtitle")}
        icon="Globe"
        badges
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <GlassCard className="overflow-hidden">
            <div className="p-4 border-b border-slate-200/70 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Icon name="House" className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-sm font-medium text-foreground">{citizen.name}'s {t("map.yourLocation")}</div>
                  <div className="text-xs text-muted-foreground">{citizen.address}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/5 text-success text-xs font-medium">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                {t("map.liveLocation")}
              </div>
            </div>

            <div style={{ height: "500px" }} className="w-full">
              <MapContainer
                center={CITIZEN_LOCATION}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Citizen location */}
                <Marker position={CITIZEN_LOCATION} icon={citizenIcon}>
                  <Popup>
                    <div className="text-center">
                      <strong>{t("map.yourLocation")}</strong>
                      <br />
                      <span className="text-xs">{citizen.name}, {citizen.district}</span>
                    </div>
                  </Popup>
                </Marker>

                {/* 2km radius circle */}
                <Circle
                  center={CITIZEN_LOCATION}
                  radius={2000}
                  pathOptions={{ color: "#0052CC", fillColor: "#0052CC", fillOpacity: 0.05 }}
                />

                {/* Office markers */}
                {filteredOffices.map((office) => {
                  const typeConfig = officeTypes.find((ot) => ot.type === office.type);
                  return (
                    <Marker
                      key={office.id}
                      position={office.coords}
                      icon={makeIcon(typeConfig?.color || "#666")}
                      eventHandlers={{
                        click: () => setSelectedOffice(office),
                      }}
                    >
                      <Popup>
                        <div className="min-w-[180px]">
                          <strong className="text-sm">{office.name}</strong>
                          <br />
                          <span className="text-xs text-muted-foreground">{t(office.typeKey)}</span>
                          <br />
                          <span className="text-xs">{office.address}</span>
                          <br />
                          <span className="text-xs font-medium text-blue-600">📍 {office.distance} {t("map.away")}</span>
                          <br />
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&origin=${CITIZEN_LOCATION[0]},${CITIZEN_LOCATION[1]}&destination=${office.coords[0]},${office.coords[1]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 underline mt-1 inline-block"
                          >
                            {t("map.directions")} →
                          </a>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>

            {/* Distance filter */}
            <div className="p-3 border-t border-slate-200/70">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Gauge" className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">{t("map.distance")}</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto">
                {distanceOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setMaxDistance(opt.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                      maxDistance === opt.value
                        ? "bg-accent text-accent-foreground"
                        : "bg-slate-100 text-muted-foreground hover:bg-slate-200"
                    )}
                  >
                    {t(opt.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            {/* Office type filter chips */}
            <div className="p-3 border-t border-slate-200/70 flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setSelectedType("All")}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                  selectedType === "All"
                    ? "bg-primary text-primary-foreground"
                    : "bg-slate-100 text-muted-foreground hover:bg-slate-200"
                )}
              >
                {t("map.allServices")} ({filteredOffices.length})
              </button>
              {officeTypes.map((ot) => {
                const count = typeCounts[ot.type] || 0;
                if (count === 0) return null;
                return (
                  <button
                    key={ot.type}
                    onClick={() => setSelectedType(ot.type)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5",
                      selectedType === ot.type
                        ? "bg-primary text-primary-foreground"
                        : "bg-slate-100 text-muted-foreground hover:bg-slate-200"
                    )}
                  >
                    <Icon name={ot.icon} className="w-3 h-3" />
                    {t(ot.typeKey)} ({count})
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Office list sidebar */}
        <div className="space-y-3 overflow-y-auto max-h-[640px]">
          <div className="text-xs text-muted-foreground px-1">
            {filteredOffices.length} {t("map.resultsFound")}
          </div>
          {filteredOffices.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <Icon name="Globe" className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">{t("map.noResults")}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("map.noResultsDesc")}</p>
            </GlassCard>
          ) : (
            filteredOffices.map((office, i) => (
              <OfficeListItem
                key={office.id}
                office={office}
                index={i}
                isSelected={selectedOffice?.id === office.id}
                onClick={() => setSelectedOffice(office)}
              />
            ))
          )}
        </div>
      </div>

      <div className="mt-6">
        <TrustBadges />
      </div>
    </div>
  );
}

function OfficeListItem({ office, index, isSelected, onClick }) {
  const { t } = useI18n();
  const typeConfig = officeTypes.find((ot) => ot.type === office.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <GlassCard
        className={cn(
          "p-4 cursor-pointer transition-all",
          isSelected ? "ring-2 ring-primary" : "hover:shadow-md"
        )}
        onClick={onClick}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${typeConfig?.color}15` }}
          >
            <Icon name={office.type_icon} className="w-5 h-5" style={{ color: typeConfig?.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground leading-tight">{office.name}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{office.address}</p>

            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-xs font-medium text-primary flex items-center gap-1">
                <Icon name="Globe" className="w-3 h-3" /> {office.distance}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Icon name="Clock" className="w-3 h-3" /> {office.hours}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Icon name="Star" className="w-3 h-3" /> {office.rating}
              </span>
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {office.services.slice(0, 3).map((s) => (
                <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-muted-foreground">
                  {s}
                </span>
              ))}
              {office.services.length > 3 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary">
                  +{office.services.length - 3} {t("map.moreServices")}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${CITIZEN_LOCATION[0]},${CITIZEN_LOCATION[1]}&destination=${office.coords[0]},${office.coords[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
              >
                <Icon name="ArrowRight" className="w-3 h-3" /> {t("map.directions")}
              </a>
              <a
                href={`tel:${office.phone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-foreground text-xs font-medium hover:bg-slate-200 transition-colors"
              >
                <Icon name="MessageCircle" className="w-3 h-3" /> {t("map.call")}
              </a>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}