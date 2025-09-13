import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";

type Paged<T> = { results: T[]; next?: string | null; previous?: string | null };

const BASE = import.meta.env.VITE_API_URL;

function useDebounced<T>(value: T, ms = 100) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

async function fetchPaged<T>({
  path,
  page,
  searchParam = "name",
  q = "",
  extraParams,
}: {
  path: string;
  page: number;
  searchParam?: string;
  q?: string;
  extraParams?: Record<string, string | number | undefined>;
}) {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("page", String(page));
  if (q?.trim()) url.searchParams.set(searchParam, q.trim());
  if (extraParams) {
    Object.entries(extraParams).forEach(([k, v]) => {
      if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
    });
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return (await res.json()) as Paged<any>;
}

const Section: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <section className="w-full rounded-xl bg-transparent backdrop-blur-xl border-0 p-3">
    {children}
  </section>
);

export default function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateQuery = React.useCallback(
    (patch: Record<string, string | undefined>) => {
      const sp = new URLSearchParams(searchParams);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === undefined || v === "") sp.delete(k);
        else sp.set(k, v);
      });
      setSearchParams(sp, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const [institution, setInstitution] = React.useState("");
  const [institutionLabel, setInstitutionLabel] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [subjectLabel, setSubjectLabel] = React.useState("");

  const [teaching, setTeaching] = React.useState("");
  const [gender, setGender] = React.useState("");

  const [division, setDivision] = React.useState("");
  const [divisionLabel, setDivisionLabel] = React.useState("");
  const [district, setDistrict] = React.useState("");
  const [districtLabel, setDistrictLabel] = React.useState("");
  const [upazila, setUpazila] = React.useState("");
  const [upazilaLabel, setUpazilaLabel] = React.useState("");
  const [area, setArea] = React.useState("");
  const [areaLabel, setAreaLabel] = React.useState("");

  return (
    <Section>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-x-6 gap-y-6">
        <InfiniteSelect
          className="col-span-1 sm:col-span-1 xl:col-span-3"
          label="Institution"
          placeholder="Select Institution"
          value={institution}
          valueLabel={institutionLabel}
          onChange={(val, lbl) => {
            setInstitution(val);
            setInstitutionLabel(lbl);
            updateQuery({ institution: val });
          }}
          fetchConfig={{ path: "/api/institutes/", searchParam: "name" }}
          valueKey="id"
          labelKey="name"
          withDivider
        />

        <InfiniteSelect
          className="col-span-1 sm:col-span-1 xl:col-span-3"
          label="Subject"
          placeholder="Select Subject"
          value={subject}
          valueLabel={subjectLabel}
          onChange={(val, lbl) => {
            setSubject(val);
            setSubjectLabel(lbl);
            updateQuery({ subject: val });
          }}
          fetchConfig={{ path: "/api/subjects/", searchParam: "subject" }}
          valueKey="id"
          labelKey="subject"
          withDivider
        />

        <InlineSelect
          className="col-span-1 sm:col-span-1 xl:col-span-3 text-white"
          label="Teaching Type"
          placeholder="Select Teaching Type"
          value={teaching}
          onValueChange={setTeaching}
          options={[
            { label: "Online", value: "ONLINE" },
            { label: "Offline", value: "OFFLINE" },
            { label: "Online & Home", value: "BOTH" },
          ]}
          withDivider
        />

        <InlineSelect
          className="col-span-1 sm:col-span-1 xl:col-span-3 text-white"
          label="Gender"
          placeholder="Select Gender"
          value={gender}
          onValueChange={setGender}
          options={[
            { label: "Male", value: "MALE" },
            { label: "Female", value: "FEMALE" },
          ]}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-x-6 gap-y-6">
        <InfiniteSelect
          className="col-span-1 sm:col-span-1 xl:col-span-3"
          label="Division"
          placeholder="Select Division"
          value={division}
          valueLabel={divisionLabel}
          onChange={(val, lbl) => {
            setDivision(val);
            setDivisionLabel(lbl);
            setDistrict(""); setDistrictLabel("");
            setUpazila(""); setUpazilaLabel("");
            setArea(""); setAreaLabel("");
            updateQuery({ division: val });
          }}
          fetchConfig={{ path: "/api/divisions/", searchParam: "name" }}
          valueKey="id"
          labelKey="name"
          withDivider
        />

        <CascadingSelect
          className="col-span-1 sm:col-span-1 xl:col-span-3"
          label="District"
          placeholder="Select District"
          value={district}
          valueLabel={districtLabel}
          onChange={(val, lbl) => {
            setDistrict(val);
            setDistrictLabel(lbl);
            setUpazila(""); setUpazilaLabel("");
            setArea(""); setAreaLabel("");
            updateQuery({ districts: val });
          }}
          fetchConfig={{
            path: "/api/districts/",
            searchParam: "name",
            parentParam: "division",
            parentValue: division,
          }}
          valueKey="id"
          labelKey="name"
          disabled={!division}
          withDivider
        />

        <CascadingSelect
          className="col-span-1 sm:col-span-1 xl:col-span-3"
          label="Upazila"
          placeholder="Select Upazila"
          value={upazila}
          valueLabel={upazilaLabel}
          onChange={(val, lbl) => {
            setUpazila(val);
            setUpazilaLabel(lbl);
            setArea(""); setAreaLabel("");
            updateQuery({ upazila: val });
          }}
          fetchConfig={{
            path: "/api/upazilas/",
            searchParam: "name",
            parentParam: "district",
            parentValue: district,
          }}
          valueKey="id"
          labelKey="name"
          disabled={!district}
          withDivider
        />
        <CascadingSelect
          className="col-span-1 sm:col-span-1 xl:col-span-3"
          label="Area"
          placeholder="Select Area"
          value={area}
          valueLabel={areaLabel}
          onChange={(val, lbl) => {
            setArea(val);
            setAreaLabel(lbl);
            updateQuery({ areas: val });
          }}
          fetchConfig={{
            path: "/api/areas/",
            searchParam: "name",
            parentParam: "upazila",
            parentValue: upazila,
          }}
          valueKey="id"
          labelKey="name"
          disabled={!upazila}
        />
      </div>
    </Section>
  );
}

function InfiniteSelect({
  className = "",
  label,
  placeholder,
  value,
  valueLabel,
  onChange,
  withDivider,
  fetchConfig,
  valueKey,
  labelKey,
  disabled,
}: {
  className?: string;
  label: string;
  placeholder: string;
  value: string;
  valueLabel?: string;
  onChange: (val: string, lbl: string) => void;
  withDivider?: boolean;
  fetchConfig: { path: string; searchParam?: string };
  valueKey: string;
  labelKey: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const debounced = useDebounced(query, 300);

  const [items, setItems] = React.useState<any[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const load = React.useCallback(
    async (reset = false) => {
      if (loading) return;
      setLoading(true);
      try {
        const nextPage = reset ? 1 : page;
        const data = await fetchPaged<any>({
          path: fetchConfig.path,
          page: nextPage,
          searchParam: fetchConfig.searchParam || "name",
          q: debounced,
        });
        const list = data.results || [];
        setItems((prev) => (reset ? list : [...prev, ...list]));
        setHasMore(Boolean(data.next));
        setPage(nextPage + 1);
      } catch {
        // swallow error or add toast
      } finally {
        setLoading(false);
      }
    },
    [page, debounced, loading, fetchConfig]
  );

  React.useEffect(() => {
    if (open) load(true);
  }, [open]);

  React.useEffect(() => {
    if (open) load(true);
  }, [debounced]);

  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!open) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        load();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [open, hasMore, loading, load]);

  const currentLabel =
    value && valueLabel
      ? valueLabel
      : value
        ? items.find((i) => String(i[valueKey]) === value)?.[labelKey] || placeholder
        : placeholder;

  return (
    <div className={cn("relative w-full", className)}>
      {withDivider && (
        <span className="pointer-events-none hidden xl:block absolute right-[-12px] top-1/2 -translate-y-1/2 h-10 w-px bg-white/20" />
      )}
      <div className="min-w-0 w-full">
        <div className="h-5 text-white text-[15px] font-semibold leading-none mb-2">
          {label}
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              className={cn(
                "w-full text-left text-slate-300/85 text-[13px] leading-6 truncate bg-transparent border-0 outline-none",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {currentLabel}
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-[min(24rem,calc(100vw-2rem))] p-0 bg-slate-900/95 text-white border border-white/10 backdrop-blur-xl"
          >
            {/* Search */}
            <div className="p-2 border-b border-white/10 flex items-center gap-2">
              <Search className="h-4 w-4 opacity-60" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}…`}
                className="h-8 bg-white/5 border-white/10 text-white placeholder:text-white/60"
              />
            </div>
            {/* List + sentinel */}
            <ScrollArea className="h-64">
              <ul className="py-1">
                {items.map((item) => (
                  <li key={item[valueKey]}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(String(item[valueKey]), item[labelKey]);
                        setOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm hover:bg-white/10",
                        value === String(item[valueKey]) && "bg-white/10"
                      )}
                    >
                      {item[labelKey]}
                    </button>
                  </li>
                ))}
                {!items.length && !loading && (
                  <li className="px-3 py-4 text-sm text-white/70">No results</li>
                )}
                <div ref={sentinelRef} />
                {loading && (
                  <div className="flex items-center justify-center py-3 text-white/80">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading…
                  </div>
                )}
              </ul>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function CascadingSelect({
  className = "",
  label,
  placeholder,
  value,
  valueLabel,
  onChange,
  withDivider,
  fetchConfig,
  valueKey,
  labelKey,
  disabled,
}: {
  className?: string;
  label: string;
  placeholder: string;
  value: string;
  valueLabel?: string;
  onChange: (val: string, lbl: string) => void;
  withDivider?: boolean;
  fetchConfig: {
    path: string;
    searchParam?: string;
    parentParam: string; // e.g., "division" | "district" | "upazila"
    parentValue: string; // selected parent id
  };
  valueKey: string;
  labelKey: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const debounced = useDebounced(query, 300);

  const [items, setItems] = React.useState<any[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [fetchConfig.parentValue]);

  const load = React.useCallback(
    async (reset = false) => {
      if (loading || !fetchConfig.parentValue) return;
      setLoading(true);
      try {
        const nextPage = reset ? 1 : page;
        const data = await fetchPaged<any>({
          path: fetchConfig.path,
          page: nextPage,
          searchParam: fetchConfig.searchParam || "name",
          q: debounced,
          extraParams: {
            [fetchConfig.parentParam]: fetchConfig.parentValue,
          },
        });
        const list = data.results || [];
        setItems((prev) => (reset ? list : [...prev, ...list]));
        setHasMore(Boolean(data.next));
        setPage(nextPage + 1);
      } catch {
      } finally {
        setLoading(false);
      }
    },
    [page, debounced, loading, fetchConfig]
  );

  React.useEffect(() => {
    if (open && fetchConfig.parentValue) load(true);
  }, [open, fetchConfig.parentValue]);

  React.useEffect(() => {
    if (open && fetchConfig.parentValue) load(true);
  }, [debounced]);

  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!open || !fetchConfig.parentValue) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        load();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [open, hasMore, loading, load, fetchConfig.parentValue]);

  const currentLabel =
    value && valueLabel
      ? valueLabel
      : value
        ? items.find((i) => String(i[valueKey]) === value)?.[labelKey] || placeholder
        : placeholder;

  return (
    <div className={cn("relative w-full", className)}>
      {withDivider && (
        <span className="pointer-events-none hidden xl:block absolute right-[-12px] top-1/2 -translate-y-1/2 h-10 w-px bg-white/20" />
      )}
      <div className="min-w-0 w-full">
        <div className="h-5 text-white text-[15px] font-semibold leading-none mb-2">
          {label}
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              className={cn(
                "w-full text-left text-slate-300/85 text-[13px] leading-6 truncate bg-transparent border-0 outline-none",
                (disabled || !fetchConfig.parentValue) && "opacity-50 cursor-not-allowed"
              )}
            >
              {currentLabel}
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-[min(24rem,calc(100vw-2rem))] p-0 bg-slate-900/95 text-white border border-white/10 backdrop-blur-xl"
          >
            {/* Search */}
            <div className="p-2 border-b border-white/10 flex items-center gap-2">
              <Search className="h-4 w-4 opacity-60" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}…`}
                className="h-8 bg-white/5 border-white/10 text-white placeholder:text-white/60"
              />
            </div>
            <ScrollArea className="h-64">
              <ul className="py-1">
                {items.map((item) => (
                  <li key={item[valueKey]}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(String(item[valueKey]), item[labelKey]);
                        setOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm hover:bg-white/10",
                        value === String(item[valueKey]) && "bg-white/10"
                      )}
                    >
                      {item[labelKey]}
                    </button>
                  </li>
                ))}
                {!items.length && !loading && (
                  <li className="px-3 py-4 text-sm text-white/70">No results</li>
                )}
                <div ref={sentinelRef} />
                {loading && (
                  <div className="flex items-center justify-center py-3 text-white/80">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading…
                  </div>
                )}
              </ul>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function InlineSelect({
  className = "",
  label,
  placeholder,
  value,
  onValueChange,
  options,
  disabled,
  withDivider = false,
}: {
  className?: string;
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (v: string) => void;
  options: { label: string; value: string }[];
  disabled?: boolean;
  withDivider?: boolean;
}) {
  return (
    <div className={cn("relative w-full text-white", className)}>
      {withDivider && (
        <span className="pointer-events-none hidden xl:block absolute right-[-12px] top-1/2 -translate-y-1/2 h-10 w-px bg-white/20" />
      )}
      <div className="min-w-0 w-full">
        <div className="h-5 text-white text-[15px] font-semibold leading-none mb-2">
          {label}
        </div>
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger className="h-auto px-0 py-0 bg-transparent border-0 shadow-none focus:ring-0 focus:ring-offset-0 justify-between w-full">
            <SelectValue
              placeholder={placeholder}
              className="text-slate-300/85 text-[13px] leading-6 truncate"
            />
          </SelectTrigger>
          <SelectContent
            align="start"
            className="bg-slate-900/95 text-white border border-white/10 backdrop-blur-xl"
          >
            {options.map((o) => (
              <SelectItem
                key={o.value}
                value={o.value}
                className="focus:bg-white/10 data-[highlighted]:bg-white/10 text-white"
              >
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
