//I made this  because I preferred the handing of item/track selection in Cubase/Pro Tools. 
//This EEL script will run in the background: Upon selecting an item, it will select the track it's on.
//Upon deselecting an item, it will  deselect the track it's on, if it contains no other selected items.
//If you're going to use this, make sure you have 'Editing Behaviour > Mouse click/edit in track view changes track selection' unchecked

//Uncomment the commented script for a debug readout.

function msg(s)(ShowConsoleMsg(s));

function SelectTrack_OnItemSelect_Monitor()(
	stored=1;
	
	// DEBUG \\
	// msg("stored_total=");
	// msg(sprintf(#,"%i",stored_total););
	// msg("\nvalues:");	
	// j=0;loop(stored_total, 
		// msg(" stored[");
		// msg(sprintf(#,"%i",j));
		// msg("]=");
		// msg(sprintf(#,"%i",stored[j]));
		// msg(" | ");
		// j+=1;
	// );
	// msg("\n");
	
	// CLEAR OLD ITEMS	
	(stored_total > 0) ? (
		// msg("Begin clearing check:\n");
		i=0;
		
		loop(stored_total,
			!IsMediaItemSelected(stored[i]) ? (
			
				(t = GetMediaItem_Track(stored[i])) && (t_items=CountTrackMediaItems(t) == 0) ? (
					k=0;
					loop(CountSelectedMediaItems(0), 
						t==GetMediaItem_Track(GetSelectedMediaItem(0, k)) ? has_selected=true);		
				);
				
				!has_selected ? SetMediaTrackInfo_Value(t, "I_SELECTED", 0);
				i == (stored_total-1) ? stored[i]=0 : stored[i] = stored[stored_total-1]; // 'Dirty' inline the list.
				stored_total-=1;
				// msg("Cleared.\n")
			);
		i += 1;
		);
	);
		
	((items = CountSelectedMediaItems(0)) == 0) ? (
		memset(stored,0,1024);
		stored_total=0;
	)
	:(
		i=0; 
		loop(items,
			
			sel_item = GetSelectedMediaItem(0, i);
			found=0;
			
			// msg("sel_item = ");
			// msg(sprintf(#,"%i",sel_item));
			// msg("\n");
			// msg(" i = (");
			// msg(sprintf(#,"%i",i));
			// msg(")\n");
			
			// OLD ITEM
			(stored_total > 0) ? (
				// msg("Has it been stored: ");			
				j=0; loop(stored_total,
					(sel_item == stored[j]) ? (
						found=1;
						// msg("Yes, it's stored.\n");
						break;
					);	
					j+=1
				);
			);
			
			// msg("found= ");
			// msg(sprintf(#,"%i",found));
			// msg("\n");
			
			// NEW ITEM
			(found == 0) ? (
				stored[stored_total]=sel_item;
				
				// msg("NEW stored[");
				// msg(sprintf(#,"%i",stored_total));
				// msg("]=");
				// msg(sprintf(#,"%i",stored[stored_total]));
				// msg("\n");
				
				stored_total+=1;
				
				
				(track_id = GetMediaItem_Track(sel_item)) ? (
					SetMediaTrackInfo_Value(track_id, "I_SELECTED", 1);			
					// GetSetMediaTrackInfo_String(track_id, "P_NAME", #track_name, 0);
				);
				
				// (take_count = CountTakes(sel_item)) ? (
					// (active_take = GetActiveTake(sel_item)) ? (
						// GetTakeName(#act_take_name, active_take);	
						// msg("Item name: ");
						// msg(#act_take_name);
						// msg("\n");		
					// );
				// );	
			);
			
			i+=1;
		);
		
	);
	defer("SelectTrack_OnItemSelect_Monitor();")
);

SelectTrack_OnItemSelect_Monitor();
